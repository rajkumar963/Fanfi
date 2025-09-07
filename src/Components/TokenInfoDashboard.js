import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import ResponsiveAppBar from './ResponsiveAppBar';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, LineChart, Line
} from 'recharts';

const TokenInfoDashboard = () => {
  const {token_address} = useParams();
  // BSC Testnet addresses
  const PANCAKE_ROUTER_ADDRESS = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
  const WBNB_ADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
  
  // Hardcoded BNB price for demo purposes
  const BNB_PRICE_USD = 300;
  
  // State variables
  const [tokenAddress, setTokenAddress] = useState(token_address);
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [priceData, setPriceData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [timeInterval, setTimeInterval] = useState('1D');
  const [chartType, setChartType] = useState('area');
  const [priceChange, setPriceChange] = useState({ '24h': 0, '7d': 0, '30d': 0 });

  // Contract ABIs
  const routerABI = [
    "function factory() external view returns (address)"
  ];

  const tokenABI = [
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
    "function name() external view returns (string)",
    "function totalSupply() external view returns (uint256)"
  ];

  const factoryABI = [
    "function getPair(address tokenA, address tokenB) external view returns (address pair)"
  ];

  const pairABI = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)"
  ];

  // Connect to BSC Testnet
  const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');

  const fetchTokenData = async () => {
    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
      setError('Please enter a valid token address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTokenData(null);
      setPriceData([]);
      setVolumeData([]);

      // Fetch token metadata
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const [symbol, name, decimals, totalSupply] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.name(),
        tokenContract.decimals(),
        tokenContract.totalSupply()
      ]);

      // Fetch liquidity pool data
      const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, routerABI, provider);
      const factoryAddress = await router.factory();
      const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
      const pairAddress = await factory.getPair(tokenAddress, WBNB_ADDRESS);

      if (pairAddress === ethers.constants.AddressZero) {
        setTokenData({
          symbol,
          name,
          decimals,
          totalSupply,
          priceUSD: 0,
          marketCapUSD: 0,
          tvlUSD: 0,
          pairExists: false
        });
        return;
      }

      // Fetch pair reserves
      const pair = new ethers.Contract(pairAddress, pairABI, provider);
      const [reserves, token0Address] = await Promise.all([
        pair.getReserves(),
        pair.token0()
      ]);

      // Determine reserve order
      const isToken0 = tokenAddress.toLowerCase() === token0Address.toLowerCase();
      const tokenReserve = isToken0 ? reserves.reserve0 : reserves.reserve1;
      const wbnbReserve = isToken0 ? reserves.reserve1 : reserves.reserve0;

      // Calculate token price in BNB and USD
      const tokenPriceInBNB = Number(
        ethers.utils.formatUnits(
          wbnbReserve.mul(ethers.BigNumber.from(10).pow(decimals)).div(tokenReserve),
          18
        )
      );
      
      const tokenPriceUSD = tokenPriceInBNB * BNB_PRICE_USD;

      // Calculate market cap
      const totalSupplyFormatted = Number(ethers.utils.formatUnits(totalSupply, decimals));
      const marketCapUSD = totalSupplyFormatted * tokenPriceUSD;

      // Calculate TVL
      const tokenValueUSD = Number(ethers.utils.formatUnits(tokenReserve, decimals)) * tokenPriceUSD;
      const wbnbValueUSD = Number(ethers.utils.formatUnits(wbnbReserve, 18)) * BNB_PRICE_USD;
      const tvlUSD = tokenValueUSD + wbnbValueUSD;

      const tokenInfo = {
        symbol,
        name,
        decimals,
        totalSupply: totalSupplyFormatted,
        priceUSD: tokenPriceUSD,
        marketCapUSD,
        tvlUSD,
        pairExists: true
      };

      setTokenData(tokenInfo);
      
      // Generate mock chart data only if pair exists and price is valid
      if (tokenPriceUSD > 0) {
        generateTradingViewData(tokenPriceUSD);
      }

    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Failed to fetch token data. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate TradingView-like data with realistic price movements
  const generateTradingViewData = (currentPrice) => {
    const now = Date.now();
    const dataPointsCount = 300; // More points for smoother chart
    const timeUnit = 3600000; // 1 hour in milliseconds
    
    const newPriceData = [];
    const newVolumeData = [];
    
    // Simulate realistic price movements with trends and corrections
    let price = currentPrice;
    let trend = (Math.random() - 0.5) * 0.2; // Initial trend (-10% to +10%)
    let volatility = 0.02 + Math.random() * 0.03; // Base volatility
    
    // Calculate price changes for different time periods
    let price24h = currentPrice;
    let price7d = currentPrice;
    let price30d = currentPrice;
    
    for (let i = dataPointsCount - 1; i >= 0; i--) {
      const timeOffset = i * timeUnit;
      const date = new Date(now - timeOffset);
      
      // Occasionally change the trend
      if (Math.random() < 0.02) {
        trend += (Math.random() - 0.5) * 0.1;
        // Keep trend within bounds
        trend = Math.max(-0.15, Math.min(0.15, trend));
      }
      
      // Occasionally have higher volatility (news events)
      if (Math.random() < 0.05) {
        volatility = 0.05 + Math.random() * 0.1;
      } else {
        volatility = 0.02 + Math.random() * 0.03;
      }
      
      // Apply price change
      const change = trend + (Math.random() - 0.5) * volatility;
      price = price * (1 + change);
      
      // Store prices for different time periods
      if (i === 24) price24h = price;
      if (i === 168) price7d = price;
      if (i === 720) price30d = price;
      
      // Format time label based on interval
      let label = '';
      if (timeInterval === '1H') {
        label = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false });
      } else if (timeInterval === '4H') {
        if (date.getHours() % 4 === 0) {
          label = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false });
        }
      } else if (timeInterval === '1D') {
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timeInterval === '1W') {
        if (date.getDay() === 1) { // Monday
          label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      } else { // 1M
        if (date.getDate() === 1) {
          label = date.toLocaleDateString('en-US', { month: 'short' });
        }
      }
      
      // Simulate volume (higher when price moves more)
      const volume = 10000 + Math.abs(change * 500000) + Math.random() * 50000;
      
      newPriceData.push({
        time: date.getTime(),
        date: date.toISOString(),
        price: price,
        label: label
      });
      
      newVolumeData.push({
        time: date.getTime(),
        date: date.toISOString(),
        volume: volume,
        label: label
      });
    }
    
    setPriceData(newPriceData);
    setVolumeData(newVolumeData);
    setPriceChange({
      '24h': ((currentPrice - price24h) / price24h) * 100,
      '7d': ((currentPrice - price7d) / price7d) * 100,
      '30d': ((currentPrice - price30d) / price30d) * 100
    });
  };

  // Filter data based on selected time interval
  const getFilteredData = () => {
    if (!priceData.length) return { priceData: [], volumeData: [] };
    
    const now = Date.now();
    let cutoffTime;
    
    switch(timeInterval) {
      case '1H':
        cutoffTime = now - 3600000; // 1 hour
        break;
      case '4H':
        cutoffTime = now - 14400000; // 4 hours
        break;
      case '1D':
        cutoffTime = now - 86400000; // 1 day
        break;
      case '1W':
        cutoffTime = now - 604800000; // 1 week
        break;
      case '1M':
        cutoffTime = now - 2592000000; // 30 days
        break;
      case '3M':
        cutoffTime = now - 7776000000; // 90 days
        break;
      default:
        cutoffTime = now - 86400000; // Default to 1 day
    }
    
    const filteredPriceData = priceData.filter(d => d.time >= cutoffTime);
    const filteredVolumeData = volumeData.filter(d => d.time >= cutoffTime);
    
    // For longer timeframes, we might want to aggregate data points
    if (timeInterval === '1M' || timeInterval === '3M') {
      const aggregatedPriceData = [];
      const aggregatedVolumeData = [];
      const aggregationFactor = timeInterval === '1M' ? 24 : 72; // Aggregate by day for 1M, 3 days for 3M
      
      for (let i = 0; i < filteredPriceData.length; i += aggregationFactor) {
        const slice = filteredPriceData.slice(i, i + aggregationFactor);
        const volumeSlice = filteredVolumeData.slice(i, i + aggregationFactor);
        
        if (slice.length) {
          const open = slice[0].price;
          const close = slice[slice.length - 1].price;
          const high = Math.max(...slice.map(d => d.price));
          const low = Math.min(...slice.map(d => d.price));
          
          aggregatedPriceData.push({
            ...slice[0],
            price: close,
            open,
            high,
            low
          });
          
          aggregatedVolumeData.push({
            ...volumeSlice[0],
            volume: volumeSlice.reduce((sum, d) => sum + d.volume, 0)
          });
        }
      }
      
      return {
        priceData: aggregatedPriceData,
        volumeData: aggregatedVolumeData
      };
    }
    
    return {
      priceData: filteredPriceData,
      volumeData: filteredVolumeData
    };
  };

  useEffect(() => {
    fetchTokenData();
  }, [tokenAddress]);

  // Handle time interval change
  const handleIntervalChange = (interval) => {
    setTimeInterval(interval);
  };

  // Handle chart type change
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const { priceData: filteredPriceData, volumeData: filteredVolumeData } = getFilteredData();

  // Calculate chart height based on window size
  const chartHeight = Math.min(window.innerHeight * 0.6, 500);

  // Styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: '#0E0E0E',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    color: '#FFFFFF'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #1E1E1E'
  };

  const titleContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const tokenSymbolStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#FFFFFF'
  };

  const tokenNameStyle = {
    fontSize: '16px',
    color: '#8F8F8F',
    marginTop: '4px'
  };

  const priceContainerStyle = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px'
  };

  const priceStyle = {
    fontSize: '32px',
    fontWeight: '700'
  };

  const priceChangeStyle = (change) => ({
    fontSize: '16px',
    fontWeight: '600',
    color: change >= 0 ? '#0ECB81' : '#F6465D',
    backgroundColor: change >= 0 ? 'rgba(14, 203, 129, 0.1)' : 'rgba(246, 70, 93, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px'
  });

  const timePeriodChangeStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '8px'
  };

  const timePeriodStyle = (active) => ({
    fontSize: '12px',
    color: active ? '#F0B90B' : '#8F8F8F',
    cursor: 'pointer'
  });

  const chartControlsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const intervalSelectorStyle = {
    display: 'flex',
    gap: '8px',
    backgroundColor: '#1E1E1E',
    borderRadius: '8px',
    padding: '4px'
  };

  const intervalButtonStyle = (active) => ({
    padding: '6px 12px',
    backgroundColor: active ? '#2B2B2B' : 'transparent',
    color: active ? '#F0B90B' : '#8F8F8F',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    transition: 'all 0.2s'
  });

  const chartTypeSelectorStyle = {
    display: 'flex',
    gap: '8px'
  };

  const chartTypeButtonStyle = (active) => ({
    padding: '6px 12px',
    backgroundColor: active ? '#2B2B2B' : 'transparent',
    color: active ? '#F0B90B' : '#8F8F8F',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    transition: 'all 0.2s'
  });

  const chartContainerStyle = {
    backgroundColor: '#131313',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px'
  };

  const chartHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const chartTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF'
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginTop: '20px'
  };

  const statCardStyle = {
    backgroundColor: '#1E1E1E',
    borderRadius: '12px',
    padding: '16px'
  };

  const statTitleStyle = {
    fontSize: '14px',
    color: '#8F8F8F',
    marginBottom: '8px'
  };

  const statValueStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#FFFFFF'
  };

  const statChangeStyle = (change) => ({
    fontSize: '14px',
    color: change >= 0 ? '#0ECB81' : '#F6465D',
    marginTop: '4px'
  });

  const tradeButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#F0B90B',
    color: '#0E0E0E',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#F8D33A'
    }
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    flexDirection: 'column'
  };

  const spinnerStyle = {
    border: '4px solid rgba(240, 185, 11, 0.3)',
    borderTop: '4px solid #F0B90B',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  };

  const errorStyle = {
    color: '#F6465D',
    backgroundColor: 'rgba(246, 70, 93, 0.1)',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '20px',
    fontWeight: '500',
    textAlign: 'center'
  };

  // Custom tooltip for price chart
  const PriceTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: '#1E1E1E',
          border: '1px solid #2B2B2B',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ color: '#8F8F8F', fontSize: '12px', marginBottom: '4px' }}>
            {new Date(data.time).toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: chartType === 'candle' ? 
                (data.open < data.close ? '#0ECB81' : '#F6465D') : '#F0B90B',
              borderRadius: '2px'
            }}></div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              Price: ${data.price.toFixed(8)}
            </div>
          </div>
          {chartType === 'candle' && (
            <>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>
                <span style={{ color: '#8F8F8F' }}>O:</span> ${data.open.toFixed(8)}
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: '#8F8F8F' }}>H:</span> ${data.high.toFixed(8)}
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: '#8F8F8F' }}>L:</span> ${data.low.toFixed(8)}
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: '#8F8F8F' }}>C:</span> ${data.close.toFixed(8)}
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for volume chart
  const VolumeTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: '#1E1E1E',
          border: '1px solid #2B2B2B',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ color: '#8F8F8F', fontSize: '12px', marginBottom: '4px' }}>
            {new Date(data.time).toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            Volume: ${data.volume.toLocaleString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ backgroundColor: '#0E0E0E', minHeight: '100vh' }}>
      <ResponsiveAppBar 
        homeButtonStyle="outlined" 
        earnButtonStyle="contained" 
        createButtonStyle="outlined" 
        chatButtonStyle="contained" 
        dashboardButtonStyle="outlined"
      />
   
   <br></br> <br></br> 
      <div style={containerStyle}>
        {loading && (
          <div style={loadingStyle}>
            <div style={spinnerStyle}></div>
            <p>Fetching token data from blockchain...</p>
          </div>
        )}

        {error && <div style={errorStyle}>{error}</div>}

        {tokenData && (
          <>
            <div style={headerStyle}>
          
              <div>
                <div style={titleContainerStyle}>
                  <div>
                    <div style={tokenSymbolStyle}>{tokenData.symbol}</div>
                    <div style={tokenNameStyle}>{tokenData.name}</div>
                  </div>
                  <button 
                    style={tradeButtonStyle}
                    onClick={() => window.location.href=`/swap/${token_address}`}
                  >
                    Trade
                  </button>
                </div>
                
                <div style={priceContainerStyle}>
                  <div style={priceStyle}>
                    ${tokenData.priceUSD > 0.01 ? tokenData.priceUSD.toFixed(4) : tokenData.priceUSD.toFixed(8)}
                  </div>
                  <div style={priceChangeStyle(priceChange['24h'])}>
                    {priceChange['24h'] >= 0 ? '+' : ''}{priceChange['24h'].toFixed(2)}%
                  </div>
                </div>
                
                <div style={timePeriodChangeStyle}>
                  <div style={timePeriodStyle(false)}>24h: <span style={priceChangeStyle(priceChange['24h'])}>
                    {priceChange['24h'] >= 0 ? '+' : ''}{priceChange['24h'].toFixed(2)}%
                  </span></div>
                  <div style={timePeriodStyle(false)}>7d: <span style={priceChangeStyle(priceChange['7d'])}>
                    {priceChange['7d'] >= 0 ? '+' : ''}{priceChange['7d'].toFixed(2)}%
                  </span></div>
                  <div style={timePeriodStyle(false)}>30d: <span style={priceChangeStyle(priceChange['30d'])}>
                    {priceChange['30d'] >= 0 ? '+' : ''}{priceChange['30d'].toFixed(2)}%
                  </span></div>
                </div>
              </div>
              
              <div style={statsContainerStyle}>
                <div style={statCardStyle}>
                  <div style={statTitleStyle}>Market Cap</div>
                  <div style={statValueStyle}>
                    ${tokenData.marketCapUSD > 1000000 
                      ? `${(tokenData.marketCapUSD / 1000000).toFixed(2)}M` 
                      : tokenData.marketCapUSD > 1000 
                        ? `${(tokenData.marketCapUSD / 1000).toFixed(2)}K` 
                        : tokenData.marketCapUSD.toFixed(2)}
                  </div>
                </div>
                
                <div style={statCardStyle}>
                  <div style={statTitleStyle}>Total Supply</div>
                  <div style={statValueStyle}>
                    {tokenData.totalSupply > 1000000 
                      ? `${(tokenData.totalSupply / 1000000).toFixed(2)}M` 
                      : `${tokenData.totalSupply.toFixed(0)}`}
                  </div>
                </div>
                
                <div style={statCardStyle}>
                  <div style={statTitleStyle}>Liquidity</div>
                  <div style={statValueStyle}>
                    ${tokenData.tvlUSD > 1000000 
                      ? `${(tokenData.tvlUSD / 1000000).toFixed(2)}M` 
                      : tokenData.tvlUSD > 1000 
                        ? `${(tokenData.tvlUSD / 1000).toFixed(2)}K` 
                        : tokenData.tvlUSD.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price Chart */}
            <div style={chartContainerStyle}>
              <div style={chartHeaderStyle}>
                <div style={chartTitleStyle}>Price Chart</div>
                <div style={chartControlsStyle}>
                  <div style={intervalSelectorStyle}>
                    {['1H', '4H', '1D', '1W', '1M'].map(interval => (
                      <button
                        key={interval}
                        style={intervalButtonStyle(timeInterval === interval)}
                        onClick={() => handleIntervalChange(interval)}
                      >
                        {interval}
                      </button>
                    ))}
                  </div>
                  <div style={chartTypeSelectorStyle}>
                    <button
                      style={chartTypeButtonStyle(chartType === 'area')}
                      onClick={() => handleChartTypeChange('area')}
                    >
                      Area
                    </button>
                    <button
                      style={chartTypeButtonStyle(chartType === 'line')}
                      onClick={() => handleChartTypeChange('line')}
                    >
                      Line
                    </button>
                    <button
                      style={chartTypeButtonStyle(chartType === 'candle')}
                      onClick={() => handleChartTypeChange('candle')}
                    >
                      Candles
                    </button>
                  </div>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={chartHeight}>
                {chartType === 'candle' ? (
                // In the BarChart section for candlesticks:
<BarChart data={filteredPriceData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
  <XAxis 
    dataKey="label"
    axisLine={false}
    tickLine={false}
    tick={{ fill: '#8F8F8F', fontSize: 12 }}
    interval={Math.floor(filteredPriceData.length / 8)}
  />
  <YAxis 
    domain={['auto', 'auto']}
    orientation="right"
    axisLine={false}
    tickLine={false}
    tick={{ fill: '#8F8F8F', fontSize: 12 }}
    tickFormatter={(value) => `$${value.toFixed(4)}`}
  />
  <Tooltip 
    content={<PriceTooltip />}
    cursor={{ fill: 'rgba(240, 185, 11, 0.1)' }}
  />
  <Bar 
    dataKey="price"
    shape={(props) => {
      const { x, y, width, height, open, close } = props;
      const isUp = close >= open;
      const color = isUp ? '#0ECB81' : '#F6465D';
      const candleWidth = width * 0.6; // Make candles narrower than the available space
      const candleX = x + (width - candleWidth) / 2; // Center the candle
      
      // Calculate wick positions
      const high = props.high || Math.max(open, close);
      const low = props.low || Math.min(open, close);
      const candleTop = isUp ? y + (high - close) : y + (high - open);
      const candleBottom = isUp ? y + (high - open) : y + (high - close);
      
      return (
        <g>
          {/* Upper wick */}
          <line 
            x1={x + width / 2} 
            y1={y} 
            x2={x + width / 2} 
            y2={candleTop} 
            stroke={color} 
            strokeWidth={1}
          />
          
          {/* Lower wick */}
          <line 
            x1={x + width / 2} 
            y1={candleBottom} 
            x2={x + width / 2} 
            y2={y + height} 
            stroke={color} 
            strokeWidth={1}
          />
          
          {/* Candle body */}
          <rect 
            x={candleX} 
            y={candleTop} 
            width={candleWidth} 
            height={Math.max(1, candleBottom - candleTop)} // Ensure minimum height of 1px
            fill={color}
          />
        </g>
      );
    }}
  />
</BarChart>
                ) : chartType === 'line' ? (
                  <LineChart data={filteredPriceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
                    <XAxis 
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8F8F8F', fontSize: 12 }}
                      interval={Math.floor(filteredPriceData.length / 8)}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8F8F8F', fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toFixed(4)}`}
                    />
                    <Tooltip 
                      content={<PriceTooltip />}
                      cursor={{ stroke: '#F0B90B', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#F0B90B" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, stroke: '#F0B90B', strokeWidth: 2, fill: '#1E1E1E' }}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={filteredPriceData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F0B90B" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
                    <XAxis 
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8F8F8F', fontSize: 12 }}
                      interval={Math.floor(filteredPriceData.length / 8)}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8F8F8F', fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toFixed(4)}`}
                    />
                    <Tooltip 
                      content={<PriceTooltip />}
                      cursor={{ stroke: '#F0B90B', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#F0B90B" 
                      fill="url(#colorPrice)" 
                      strokeWidth={2}
                      activeDot={{ r: 6, stroke: '#F0B90B', strokeWidth: 2, fill: '#1E1E1E' }}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
            
            {/* Volume Chart */}
            <div style={chartContainerStyle}>
              <div style={chartHeaderStyle}>
                <div style={chartTitleStyle}>Volume</div>
              </div>
              
              <ResponsiveContainer width="100%" height={chartHeight * 0.4}>
                <BarChart data={filteredVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
                  <XAxis 
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8F8F8F', fontSize: 12 }}
                    interval={Math.floor(filteredVolumeData.length / 8)}
                  />
                  <YAxis 
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8F8F8F', fontSize: 12 }}
                    tickFormatter={(value) => value >= 1000000 
                      ? `$${(value/1000000).toFixed(1)}M` 
                      : value >= 1000 
                        ? `$${(value/1000).toFixed(0)}K` 
                        : `$${value}`}
                  />
                  <Tooltip 
                    content={<VolumeTooltip />}
                    cursor={{ fill: 'rgba(240, 185, 11, 0.1)' }}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="#3D3D3D"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          body {
            background-color: #0E0E0E;
            margin: 0;
            padding: 0;
            color: #FFFFFF;
          }
          button {
            outline: none;
          }
          button:hover {
            opacity: 0.9;
          }
        `}</style>
      </div>
    </div>
  );
};

export default TokenInfoDashboard;