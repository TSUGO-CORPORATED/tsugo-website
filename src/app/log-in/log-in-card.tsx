'use client';

// MODULES IMPORT
import React, { SyntheticEvent } from "react";
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GoogleLogIn from '../auth/google-log-in';
import { TextField,  Button,  Typography,  Paper,  Box,  InputAdornment,  Snackbar,  Alert,} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import GoogleIcon from "@mui/icons-material/Google";


// PAGE COMPONENT
export default function LogInCard(): JSX.Element {
  // const { t } = useTranslation(); 

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
        borderRadius: "16px",
        alignItems: "center",
        height: "70vh",
        margin: "0 auto",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        component="img"
        sx={{
          height: "100%",
          width: "55%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
        src="/tokyo.jpg"
      />
      <Paper
        elevation={3}
        sx={{
          padding: 10,
          height: "70vh",
          width: "45%",
          maxWidth: "500px",
          borderRadius: "16px",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Log In to Your Account
        </Typography>
        <GoogleLogIn />
        <Typography sx={{ textAlign: "center", my: 2 }}>
          ----------------------------or---------------------------------
        </Typography>
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