import React,{useEffect, useState,useRef} from 'react'
import { useOkto } from "okto-sdk-react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { QRCodeCanvas } from 'qrcode.react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import logo from '../assets/images/logo.png'
import Stack from '@mui/material/Stack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import coinImg from '../assets/images/coinImg.png'
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import './Dashboard.css'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import Confetti from 'react-confetti'
import ResponsiveAppBar from './ResponsiveAppBar';
import CountUp from 'react-countup';
import coinAnimation from '../assets/images/coinBackground3.gif'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import EventIcon from '@mui/icons-material/Event';
import CelebrationIcon from '@mui/icons-material/Celebration';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import dayjs from "dayjs";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import coinImage from '../assets/images/coinImg.png'

// import { signInWithGoogle } from "../firebase-config";
const usersCollectionRef1 = collection(db, "user");
const usersCollectionRef2 = collection(db, "ticket");

const usersCollectionRef3 = collection(db, "comments");




function Home2() {

    const [randomNumber, setRandomNumber] = useState('');
    const [showQR, setShowQR] = useState(false);
     const [showCommentsDiv,setShowCommentsDiv]=useState([])
     const [leaderboardArray,setLeaderboardArray]=useState([])
     const [showLeaderboardDiv,setShowLeaderboardDiv]=useState(false)
            const [makeComment,setMakeComment]=useState('')
            const [comments,setComments]=useState([])
            const [event_id,setEvent_id]=useState('')

            const  getLeaderboard=async ()=>{

              try{
              
                          const data = await getDocs(usersCollectionRef1);
                                                        
                             let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                   
                             let filteredArray=usersTemp.filter(obj => obj.ProfileImage!=null && obj.UserName!=null)
              
                           console.log(filteredArray)
                           filteredArray.sort((a, b) => b.Coins - a.Coins);
        
                           setLeaderboardArray(filteredArray)
        
                           setShowLeaderboardDiv(true)
                           
              
                          
                         
                                         
                      }
                      catch{
              
                          notifyCustom("Error loading leaderboard","error")
                          setInterval(()=>{
                              window.location.href="/home"
                            },3000)
                      }
            
            }
    const qrRef = useRef();
  
    const generateNumber = async(id) => {
      const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setRandomNumber(number);
      const result=await addDoc(usersCollectionRef2, {TicketId:number+localStorage.getItem('email'),EventId:id});
    
      console.log(result.id)
    
     

      setShowQR(false);
    };
  
      const notifyCustom = (text,type) => toast(text,{
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            type:type
           
            });

 const notify = () => toast("Coming Soon!",{
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
     
      });

      const notifyGift = () => toast("100 coins claimed!",{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type:'success'
       
        });
      const notifyClipboard = () => toast("Event link copied to clipboard !",{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
       
        });


        function formatDate(dateStr) {
          const date = new Date(dateStr);
        
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' }); // e.g., "Feb"
          const year = date.getFullYear();
        
          // Get ordinal suffix for day
          const getOrdinal = (n) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
              case 1: return 'st';
              case 2: return 'nd';
              case 3: return 'rd';
              default: return 'th';
            }
          };
        
          return `${day}${getOrdinal(day)} ${month}, ${year}`;
        }
    
    const downloadQRCode = () => {
      const qrCanvas = qrRef.current.querySelector('canvas');
      const originalSize = qrCanvas.width; // typically 200
      const quietZone = 60; // padding around QR
      const totalSize = originalSize + quietZone * 2;
  
      // Create new canvas
      const newCanvas = document.createElement('canvas');
      newCanvas.width = totalSize;
      newCanvas.height = totalSize;
  
      const ctx = newCanvas.getContext('2d');
  
      // Fill background with white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, totalSize, totalSize);
  
      // Draw original QR canvas onto new one with padding offset
      ctx.drawImage(qrCanvas, quietZone, quietZone);
  
      // Download
      const url = newCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `QRCode_${randomNumber}.png`;
      link.click();
    };

     const getComments=async(event_id)=>{


        
                let eventId=event_id
        
                console.log("eventId",eventId)
        
                let data = await getDocs(usersCollectionRef3);
                                     
                 let chats=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        
                 let filteredArray=chats.filter(obj=>obj.EventId==eventId)
                                   
                 console.log("fileteredArray",filteredArray)
        
                 if(filteredArray.length!=0)
        
                  {
                    data=await getDocs(usersCollectionRef1);
        
                 let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        
                 let userFilteredArray=users.filter(obj=>obj.UserName && obj.ProfileImage)
                 let userFilteredArray1=userFilteredArray.map(user=>user.Email)
                 console.log("Final UserFilteredArray",userFilteredArray)    
        
                 let chatsData=filteredArray[0].Chats.filter(obj=>userFilteredArray1.includes(obj.Sender))
                 if(chatsData.length==0)
                  {
                   setShowCommentsDiv(["not exist"])
         
                   return;
                  }
        
                 const FinalChatsData = chatsData.map(msg => {
                  const user = userFilteredArray.find(user => user.Email === msg.Sender);
                  return {
                    ...msg,
                    UserName: user?.UserName || null,
                    ProfileImage: user?.ProfileImage || null
                  };
                });
        
                 setComments(FinalChatsData)
                 
        
                 setShowCommentsDiv(FinalChatsData)
        
                 console.log("chatsData",FinalChatsData)
                  }
        
                  else{
                    setShowCommentsDiv(["not exist"])
                  }
        
        
                 
        
               }
        
              const handleSendComment=async ()=>{


                  if(!(localStorage.getItem('profileImg') && localStorage.getItem('userName')))
                            {
                              notifyCustom("Set up your profile to participate in discussions!","error")
                
                              setInterval(()=>{
                
                                window.location.href="/profilesettings"
                              },4000)

                              return;
                            }

        
                let eventId=event_id
        
                console.log("eventId",eventId)
        
        
        
                
        
                   const data = await getDocs(usersCollectionRef3);
                                        
                    let chats=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        
                    let filteredArray=chats.filter(obj=>obj.EventId==eventId)
                                      
                    console.log("fileteredArray",filteredArray)
        
                    if(filteredArray.length==0)
        
                      {
        
                       
                         const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
                                     
                                          await addDoc(usersCollectionRef3, { EventId:eventId,Chats:[{Sender:localStorage.getItem('email'),SentTo:eventId,Message:makeComment,Timestamp: now}]});
                     
                     
        
                        
                                          getComments(event_id)
                         
                       
                      }
        
                      else
        
                      {
        
        
                                    const userDoc1 = doc(db, "comments", filteredArray[0].id);
        
                                 const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        
                                    console.log("makeComment slice",makeComment.slice(0,2),makeComment.slice(0,2).length)
        
                                    if(makeComment.length>=2 && makeComment.slice(0,2)==="(@")
                                     
                                     {
                    
                                      const newFields1={EventId:eventId,Chats:[...filteredArray[0].Chats,{Sender:localStorage.getItem('email'),SentTo:makeComment.slice(2,makeComment.indexOf(')')),Message:makeComment.slice(1,makeComment.indexOf(')'))+makeComment.slice(makeComment.indexOf(')')+1),Timestamp: now}]};
                                      await updateDoc(userDoc1, newFields1);
                                    
                    
                                      getComments(event_id)
                    
                                     } 
                                     else
                                     {
                                      const newFields1 = { EventId:eventId,Chats:[...filteredArray[0].Chats,{Sender:localStorage.getItem('email'),SentTo:eventId,Message:makeComment,Timestamp: now}]};
                             
                                       // update
                             
                             
                                     await updateDoc(userDoc1, newFields1);
                                     getComments(event_id)
                                     }
                      }
                        
                                      
                        
                         
                         
              }
    

  
    // 🧠 Update canvas class after render
    useEffect(() => {
      const canvas = qrRef.current?.querySelector('canvas');
      if (canvas) {
        canvas.style.transition = 'filter 0.5s ease';
        canvas.style.filter = showQR ? 'blur(0px)' : 'blur(8px)';
      }
    }, [showQR, randomNumber]);

    const usersCollectionRef = collection(db, "events");
        const usersCollectionRef1 = collection(db, "user");
    const [coins,setCoins]=useState(localStorage.getItem('coins')?localStorage.getItem('coins'):0)
    const { showWidgetModal, closeModal } = useOkto();
    const { createWallet, getUserDetails, getPortfolio } = useOkto();
    const [createdEvents,setCreatedEvents]=useState([])
    const [registeredEvents,setRegisteredEvents]=useState([])
    const [userApprovedArray,setUserApprovedArray]=useState([])
    const [showConfetti,setShowConfetti]=useState(localStorage.getItem('count')?false:true)
    const [showDiv,setShowDiv]=useState(localStorage.getItem('count')?false:true)
    
    const createUser = async (email) => {

            try{
                await addDoc(usersCollectionRef, { Email:email, Coins: 100, EventsCreated: [], EventsRegistered: [], EventsAttended: []});
            }
            catch{
                alert('Problem Creating User')
            }
          
           
          };


    useEffect(()=>{
        getUserDetails()
        .then((result) => {
            if(!localStorage.getItem('email'))
            {
              localStorage.setItem('email',result.email)
             
             
              window.location.reload()
            }
           
            
        })
        .catch((error) => {
            console.error(`error:`, error);
        });
      },[])

      const getUserId=async ()=>{

        let data = await getDocs(usersCollectionRef1);
                                   
                    let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                  
                                   
                    let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))
                    console.log(filteredArray)
        
                    let userRegistrationsFound=filteredArray[0].EventsRegistered
                    let userApprovedFound=filteredArray[0].EventsApproved
                    let userCreationsFound=filteredArray[0].EventsCreated
                    setUserApprovedArray(userApprovedFound)
                    

                    let data1 = await getDocs(usersCollectionRef);
                                   
                    let eventsTemp=await data1.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

                    eventsTemp=eventsTemp.filter(obj=>obj.Type!="online")
                    

                    let eventsCreatedFound=eventsTemp.filter(obj =>  userCreationsFound.includes(obj.id))
                    let eventsRegistrationsFound=eventsTemp.filter(obj =>  userRegistrationsFound.includes(obj.id))
                    
                    console.log("eventsCreatedFound",eventsCreatedFound)
                    console.log("eventsRegistrationsFound",eventsRegistrationsFound)
                    setCreatedEvents(eventsCreatedFound)
                    setRegisteredEvents(eventsRegistrationsFound)
                   
                  
        
                   

      }
      useEffect(()=>{
        getUserId()
      },[])
    
  return (
    <div>
     <br></br>
           <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="contained"/>
          
    
           <br></br> <br></br>  <br></br> <br></br>  <br></br> <br></br>


           <div className="web3-coin-card">
          <div className="coin-shine-container">
            <img src={coinImage} alt="Coin" className="coin-image" />
          </div>
          <div className="coin-balance">
            <CountUp start={coins-100} end={coins} className="coin-count" />
            <span className="coin-label">COINS</span>
          </div>
          <button 
            className="web3-button leaderboard-button"
            onClick={getLeaderboard}
          >
            <LeaderboardIcon className="button-icon" />
            Leaderboard
          </button>
        </div>


  
     
<br></br>

<br></br>


<Button variant="outlined" style={{color:'#6f6aff',border:'0.2px solid #6f6aff'}} onClick={()=>{
     window.location.href = '/creator';
}}>Host Event &nbsp;<AddCircleIcon/></Button>

<Button variant="outlined" style={{color:'#6f6aff',border:'0.2px solid #6f6aff'}} onClick={()=>{

    if(localStorage.getItem('userName'))
    {
      window.location.href = `/channel/${!localStorage.getItem('userName')?localStorage.getItem('email'):localStorage.getItem('userName')}`;
    }

    else{
      notifyCustom("Set up your profile to continue","error")

      setTimeout(()=>{
        window.location.href="/profilesettings"
      },3000)
    }
     
}}>My Channel&nbsp;<DashboardIcon/></Button>


    
<br></br><br></br>
{createdEvents.length==0 && <h2 style={{color:'white'}}>Created(0)</h2>}
{createdEvents.length!=0 && <h2 style={{color:'white'}}>Created({createdEvents.length})</h2>}

<div className="events">

{createdEvents.length!=0 && createdEvents.map((x)=>{
  return(

    <Card sx={{ maxWidth: 350,minWidth:300 ,maxHeight:1000  }} style={{ position:'relative',background: 'transparent', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.5)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '20px' , border: '0.5px solid rgba(255, 255, 255,0.2)',position:'relative',borderRadius:'20px'}}>
         <CardActionArea>
           
           <img style={{width:'300px' ,height:'500px',objectFit:'cover', border: '1px solid rgba(255, 255, 255, 0.18)'}} src={x.Image} onClick={()=>{
             window.location.href=`/event/${x.id}`
           }}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>

          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
          <CalendarMonthIcon fontSize='small'/><l>{x.StartDateTime && formatDate(x.StartDateTime.substring(0,10))}</l>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
        <LocationPinIcon fontSize='small'/>
        <l>{x.Address && x.Address.slice(x.Address.lastIndexOf(",") + 1)}</l>
        </Typography>
        </Typography>

          <br></br>
          <Button variant="outlined" onClick={(e)=>{
            e.stopPropagation()
            window.location.href=`/event/${x.id}`
          }}><LaunchIcon/>  </Button>

          <Button variant="outlined" onClick={(e)=>{
            e.stopPropagation()
            setEvent_id(x.id)

            getComments(x.id)
          }}><CommentIcon/>  </Button>

          <Button variant="outlined" onClick={(e)=>{
           
          e.stopPropagation()
          
            navigator.clipboard.writeText(`https://v2-six-puce.vercel.app/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button>

          {localStorage.getItem('email') && x.Creator==localStorage.getItem('email') && 
          <Button variant="outlined" style={{color:'green'}} onClick={(e)=>{

            e.stopPropagation()
            window.location.href=`/manage/${x.id}`
          }}><EditIcon/>  </Button>
          }
        
        </CardContent>
      </CardActionArea>
    </Card>
   
  )
})}
</div>
<br></br>
<hr style={{ border: '0.5px solid rgba(255, 255, 255, 0.3)'}}></hr>
<br></br>

{registeredEvents.length==0 && <h2 style={{color:'white'}}>Registered(0)</h2>}
{registeredEvents.length!=0 && <h2 style={{color:'white'}}>Registered({registeredEvents.length})</h2>}
<div className="events">
{registeredEvents.length!=0 && registeredEvents.map((x)=>{
  return(
    <div style={{border:'2px solid black',color:'white'}}>
      
      <Card sx={{ maxWidth: 350,minWidth:300 ,maxHeight:1000  }} style={{ position:'relative',background: 'transparent', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.5)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '20px' , border: '0.5px solid rgba(255, 255, 255,0.2)',position:'relative',borderRadius:'20px'}}>
           <CardActionArea>
             
             <img style={{width:'300px' ,height:'500px',objectFit:'cover', border: '1px solid rgba(255, 255, 255, 0.18)'}} src={x.Image} onClick={()=>{
               window.location.href=`/event/${x.id}`
             }}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>

         <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
          <CalendarMonthIcon fontSize='small'/><l>{x.StartDateTime && formatDate(x.StartDateTime.substring(0,10))}</l>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
        <LocationPinIcon fontSize='small'/>
        <l>{x.Address && x.Address.slice(x.Address.lastIndexOf(",") + 1)}</l>
        </Typography>
        </Typography>
          <br></br>
          {userApprovedArray.includes(x.id) ? <div>
          
           <div> 
        

          <Button variant="outlined" onClick={(e)=>{
             e.stopPropagation()
             setEvent_id(x.id)

             getComments(x.id)
          }}><CommentIcon/>  </Button>
          
          <Button variant='outlined' color="success"
        onClick={(e)=>{
            e.stopPropagation()
         window.location.href=`/qr/${x.id}`

        }}
        className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
      >
       Get Ticket
      </Button>
      
      <Button variant="outlined" onClick={(e)=>{

            e.stopPropagation()
            navigator.clipboard.writeText(`http://localhost:3000/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button></div> }

            
            </div>:<div>
             
              
                        <Button variant="outlined" onClick={(e)=>{
                           e.stopPropagation()
                           setEvent_id(x.id)
              
                           getComments(x.id)
                        }}><CommentIcon/>  </Button>
              
              
              <Button variant="outlined">Approval Pending</Button><Button variant="outlined" onClick={(e)=>{
              e.stopPropagation()
            navigator.clipboard.writeText(`http://localhost:3000/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button></div>}
            
        </CardContent>
      </CardActionArea>
    </Card>
     
    
      </div>
  )
})}
</div>

<ToastContainer style={{zIndex:'99999999999'}}/>
<Box
  sx={{
    position: 'fixed',   // Fixes it relative to the viewport
    bottom: 30,          // 16px from the bottom
    right: 16,           // 16px from the right
    zIndex: 1000,        // Ensure it stays above other elements
    '& > :not(style)': { m: 1 },
  }}

  onClick={()=>{
    window.location.href="/creator"
  }}
>
  <Fab color="primary" aria-label="add"  size="large" style={{backgroundColor:'#6f6aff'}}>
    <AddIcon />
  </Fab>
</Box>
<br></br>
<l style={{color:'white'}}>{randomNumber}</l>
<br></br><br></br>

 <div style={{position:'fixed',bottom:'0',width:'100%'}}>
     

      <div className="full-width-bar" style={{height:'3em',borderTop:'0.1px solid rgb(255,255,255,0.5)',background: 'black', boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.5)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)'}} >
                
                  
           
                   <div style={{color:'white'}} >
           
                   
                   <Button variant="contained" style={{borderRadius:'0',backgroundColor:'#6f6aff',color:'white'}}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><LocationPinIcon fontSize='small'/> <l>Offline Events</l></div></Button>
                   <Button style={{color:'#6f6aff'}} onClick={()=>{
                    window.location.href="onlinedashboard"
                   }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><VideoCallIcon   fontSize='small'/> <l>Online Events</l></div></Button>
                  
                
           
           
                   </div>
                 
                    
                     </div>
      </div>

         
        {showCommentsDiv.length !== 0 && (
  <div style={{
    width: '100%',
    position: 'fixed',
    bottom:'0px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'hidden', // outer div doesn't scroll
    zIndex: 1000,
  }}>
    <div style={{
      width: '95%',
      height: '80vh', // panel height for scrolling content
      backgroundColor: 'black',
      border: '2px solid #1876d1',
      borderTopLeftRadius: '3em',
      borderTopRightRadius: '3em',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden', // important to clip the content inside
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      
      {/* Header */}
      <div style={{
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        color: '#1876d1',
        padding: '10px',
      }} onClick={() => {
        setShowCommentsDiv([]);
        setMakeComment("");
      }}>
<br></br>
        &nbsp;   &nbsp;   &nbsp;   
        <CancelIcon />
      </div>

      <center>
        <h2 style={{ color: 'white' }}>Discussions Panel</h2>
      </center>

      {/* Scrollable Comment Section */}
      <div style={{
        flex: 1, // fill available space
        overflowY: 'auto',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
      }}>
        {showCommentsDiv.length !== 0 && showCommentsDiv[0] !== "not exist" && showCommentsDiv.map((x, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px' }}>
            <div>
              <img
                src={x.ProfileImage}
                alt="profile"
                style={{
                  width: '1.5em',
                  height: '1.5em',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

              <div style={{display:'flex',gap:'7px'}}>
              <label style={{ color: 'white', fontSize: '14px' }}><b>{x.UserName}</b></label>
              <div style={{color:'white', fontSize: '14px'}}>{x.Timestamp && dayjs(x.Timestamp).fromNow() 
              }</div>

              </div>
              

              <div style={{ color: 'white', textAlign: 'left' }}>{x.Message}</div>
              <div
                style={{ color: 'grey', fontSize: '14px', cursor: 'pointer' }}
                onClick={() => setMakeComment(`(@${x.UserName}) `)}
              >
                Reply
              </div>
            </div>

            
          </div>
        ))}
      </div>

      {/* Fixed Input Section */}
      <div style={{
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid #444',
        backgroundColor: '#000',
      }}>
        <input
          style={{
            width: '80%',
            height: '30px',
            fontSize:'16px',
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #555',
            backgroundColor: '#111',
            color: 'white'
          }}
          value={makeComment}
          onChange={(e) => setMakeComment(e.target.value)}
        />
        <Button onClick={handleSendComment}>
          <SendIcon fontSize="large" />
        </Button>
      </div>
    </div>
  </div>
)}

{showLeaderboardDiv && (
          <div className="web3-modal">
            <div className="modal-header">
              <h3>Leaderboard</h3>
              <button className="close-button" onClick={() => setShowLeaderboardDiv(false)}>
                <CancelIcon />
              </button>
            </div>
            <div className="leaderboard-list">
              {leaderboardArray.slice(0, 5).map((x, index) => (
                <div key={index} className="leaderboard-item">
                  <div className="user-info">
                    <span className="rank">{index + 1}.</span>
                    <img src={x.ProfileImage} alt="profile" className="user-avatar" />
                    <span className="username">{x.UserName.length < 6 ? x.UserName : `${x.UserName.slice(0, 6)}...`}</span>
                  </div>
                  <div className="coin-info">
                    <img src={coinImg} alt="coin" className="coin-icon" />
                    <span className="coin-amount">{x.Coins}</span>
                  </div>
                </div>
              ))}
              {leaderboardArray.length > 0 && (
                <div className="leaderboard-item current-user">
                  <div className="user-info">
                    <span className="rank">{leaderboardArray.findIndex(obj => obj.Email === localStorage.getItem('email')) + 1}.</span>
                    <img src={leaderboardArray.filter(x => x.Email == localStorage.getItem('email'))[0].ProfileImage} alt="profile" className="user-avatar" />
                    <span className="username">You</span>
                  </div>
                  <div className="coin-info">
                    <img src={coinImg} alt="coin" className="coin-icon" />
                    <span className="coin-amount">{leaderboardArray.filter(x => x.Email == localStorage.getItem('email'))[0].Coins}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

    </div>
  )
}

export default Home2