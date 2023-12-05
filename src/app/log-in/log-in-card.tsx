'use client';

// MODULES IMPORT
import React, { SyntheticEvent } from "react";
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GoogleLogIn from '../auth/google-log-in';
import { TextField,Divider,  Button,  Typography,  Paper,  Box,  InputAdornment,  Snackbar,  Alert,} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslation } from 'next-i18next'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import fs from 'fs'

// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, [
//         'common',
//       ])),
//       // Will be passed to the page component as props
//     },
//   }
// }




// PAGE COMPONENT
export default function LogInCard(): JSX.Element {
  // const { t } = useTranslation(); 
  // const { t } = useTranslation('common')
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const router = useRouter();

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
      width: { xs: "90%", md: "90%" },
      height: { xs: "auto", md: "70vh" }
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
    src="/sun.jpg"
  />
   <Paper
    elevation={3}
    sx={{
    
      padding: { xs: 2, md: 5 },
      width: { xs: "100%", md: "50%" },
      height: { xs: "auto", md: "100%" },
      borderRadius: { xs: "16px", md: "0 16px 16px 0" },
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2, fontSize: {xs: "20px", md: "34px"}  }}>
        {/* {t('authenticationlogIn')} */}
        Log in to Your Account
        </Typography>
        <GoogleLogIn />
        <Divider sx={{ my: 2 }} />
        <Box
          component="form"
          onSubmit={logIn}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{borderRadius: '4px',
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
              textTransform: "none",
              width: "100%",
              height: "56px",
            }}
          >
            Log In
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography>Don't have an account?</Typography>
          <Link href="/sign-up">
            <Typography
              sx={{
                ml: 1,
                color: "primary.main",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                   
                  color: "secondary.main", 
                },
              }}
            >
              Sign Up
            </Typography>
          </Link>
        </Box>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  )
};