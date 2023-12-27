'use client';

// MODULES IMPORT
import React, { SyntheticEvent, } from "react";
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoogleLogIn from '../auth/google-log-in';
import { TextField, Divider,  Button,  Typography,  Paper,  Box,  InputAdornment,  Snackbar,  Alert,} from "@mui/material";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import LogInForm from './log-in-form';
// import CircularProgress from '@mui/material/CircularProgress';

// Feature for rendering random image is currently disabled
// function preloadImage(src:any) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.src = src;
//     img.onload = resolve;
//     img.onerror = reject;
//   });
// }


// PAGE COMPONENT
export default function LogInCard(): JSX.Element {
  // const { t } = useTranslation(); 

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<string>("success");
  // const [randomImage, setRandomImage] = useState<string>('')
  // const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  // const images = [
  //   '/randompics/1.jpg',
  //   '/randompics/2.jpg',
  //   '/randompics/3.jpg',
  //   '/randompics/4.jpg',
  //   '/randompics/6.jpg',
  //   '/randompics/7.jpg',
  //   '/randompics/8.jpg',
  //   '/randompics/9.jpg',
  //   '/randompics/10.jpg',
  //   '/randompics/11.jpg',
  //   '/randompics/12.jpg',
  //   '/randompics/13.jpg',
  //   '/randompics/14.jpg',
  //   '/randompics/15.jpg',
  //   '/randompics/16.jpg',
  //   '/randompics/17.jpg',
  //   '/randompics/18.jpg',
  //   '/randompics/19.jpg',
  //   '/randompics/20.jpg',
  //   '/randompics/21.jpg',
  //   '/randompics/22.jpg',
  //   '/randompics/23.jpg',
  //   '/randompics/24.jpg',
  //   '/randompics/25.jpg',
  // ];
  
  // useEffect(() => {
  //   const loadingImages = async () => {
  //     try {
  //       await Promise.all(images.map(image => preloadImage(image)));
  //       const randomIndex = Math.floor(Math.random() * images.length);
  //       setRandomImage(images[randomIndex]);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error loading images:", error);
  //     }
  //   };

  //   loadingImages();  
  // }, []);

  async function logIn(e: any): Promise<void> {
    e.preventDefault();
      // this prevents the email and password to dissapear when button is clicked, achieved by removing default

    const response: string | void | null = await signInWithEmailAndPassword(auth, email, password)
      .then((userCredintial) => {
        // console.log(userCredintial);
        // console.log(userCredintial.user.email);
        return userCredintial.user.uid;
      })
      .catch((error) => {
        console.log(error);
      });
      // this will send email and password to firebase. If correct it will return user email
    // console.log(response);
    
    if (response) {
      // alert('Successful login');
      router.push('/dashboard');
    } 
    else {
      setAlertMessage("Invalid username or password");
      setAlertSeverity("error");
      setOpen(true);
    }
  }

  const handleClose = (
    event: SyntheticEvent<any, Event> | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // if (loading) {
  //   return <CircularProgress />; 
  // }
  return (
    <Box
      sx={{
        display: "flex",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        borderRadius: "16px",
        flexDirection: { xs: "column", md: "row" },
        width: { xs: "90%", md: "1000px" },
        height: { xs: "auto", md: "65vh" }
      }}
    >
      <Box
        component="img"
        sx={{
          display: { xs: "none", md: "block" },
          width: { md: "50%" },
          height: { md: "100%" },
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        src='/logo.png'
        data-testid='logo'
      />
      <Box
        // elevation={5}
        sx={{
          padding: { xs: 2, md: 5 },
          width: { xs: "100%", md: "50%" },
          height: { xs: "auto", md: "100%" },
          borderRadius: { xs: "16px", md: "0 16px 16px 0" },
          bgcolor: 'background.paper',
          border: 1,
          borderColor: '#e0e0e0',
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ textAlign: "center", mb: 2, fontSize: {xs: "20px", md: "34px"}  
          }}
          data-testid='heading'
        >
          Log In to Your Account
        </Typography>
        <GoogleLogIn />
        <Divider sx={{ my: 2 }} />
        <LogInForm handleSubmit={logIn} email={email} password={password} setEmail={setEmail} setPassword={setPassword}/>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
};