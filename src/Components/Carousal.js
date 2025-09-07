import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Import all poster images explicitly

import poster2 from '../assets/images/posters/2.png';
import poster3 from '../assets/images/posters/3.png';
import poster4 from '../assets/images/posters/4.png';
import poster5 from '../assets/images/posters/5.png';
import poster6 from '../assets/images/posters/6.png';
import poster7 from '../assets/images/posters/7.png';
import poster8 from '../assets/images/posters/8.png';
import poster9 from '../assets/images/posters/9.png';
import poster10 from '../assets/images/posters/10.png';
import poster11 from '../assets/images/posters/11.png';
import poster12 from '../assets/images/posters/12.png';
import poster13 from '../assets/images/posters/13.png';


const PosterCarousel = () => {
  const posters = [
    poster2, poster3, poster4, poster5,
    poster6, poster7, poster8, poster9, poster10,
    poster11, poster12, poster13
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posters.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [posters.length]);

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer>
      <CarouselTrack style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {posters.map((poster, index) => (
          <CarouselSlide key={index}>
            <PosterImage src={poster} alt={`Poster ${index + 1}`} />
            <ButtonContainer>
            <ActionButton1 style={{backgroundColor:'#E41033',color:'white',borderRadius:'20px'}}>Book Tickets</ActionButton1>
              <ActionButton2 style={{color:'#6F6AFF',borderRadius:'20px',border:'1px solid #6F6AFF',backgroundColor:'transparent', marginLeft:'10px'}}>Trade</ActionButton2>
          
            </ButtonContainer>
          </CarouselSlide>
        ))}
      </CarouselTrack>
      
      <DotsContainer>
        {posters.map((_, index) => (
          <Dot 
            key={index} 
            active={index === currentIndex}
            onClick={() => goToIndex(index)}
          />
        ))}
      </DotsContainer>
    </CarouselContainer>
  );
};

// Styled Components
const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
 
`;

const CarouselSlide = styled.div`
  min-width: 100%;
  position: relative;
`;

const PosterImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  aspect-ratio: 2000 / 600;

  @media (max-width: 768px) {
    object-fit: contain;
    aspect-ratio: auto;
    height:10em
  }
`;


const ButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: column;
    bottom: 10px;
    left: 10px;
    width:2em
  }
`;

const ActionButton1 = styled.button`
 
  margin-left: 130px;
  background-color: ${props => props.bgColor};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  width: 10em;
 

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
   position: absolute;
   margin-top: -20px;
    font-size: 10px;
    width: 10em;
    height: 3em;
    margin-left: 30px;
   

  }
`;
const ActionButton2 = styled.button`
  padding: 10px 20px;
  margin-left: 130px;
  background-color: ${props => props.bgColor};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  width: 10em;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
  margin-left: 250px;
    padding: 8px 16px;
     font-size: 10px;
    width: 6em;
    height: 3em;
    display: none;

  }
`;
const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 2;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: white;
  }

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

export default PosterCarousel;