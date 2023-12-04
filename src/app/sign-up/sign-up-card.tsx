'use client';

// MODULES IMPORT
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import axios from 'axios';
import GoogleLogIn from '../auth/google-log-in';
import { TextField, Button, Typography, Paper, Box, InputAdornment} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// PAGE COMPONENT
export default function SignUpCard(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const router = useRouter();


  async function passwordSignUp(e: any): Promise<void> {
    e.preventDefault();
      // this prevents the email and password to dissapear when button is clicked, achieved by removing default
    
    // Guard function, abort function if account is already registered
    // const url: string = `http://localhost:8080/user/check/${email}`;
    const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/user/check/${email}`;
    const checkUserAvailability: boolean = await axios.get(url).then(res => res.data);
    if (checkUserAvailability) {
      alert('You are already registered, please log in');
      return
    }

    // Creating user
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredintial) => {
        // Indicate success
        // console.log(userCredintial);
        alert("Create user successful in firebase");

        // Registering user to the backend
        const newUserData = {
          uid: userCredintial.user.uid,
          email: email,
          firstName: firstName,
          lastName: lastName,
        };
        // const url: string = 'http://localhost:8080/user';
        const url: string = 'https://senior-project-server-8090ce16e15d.herokuapp.com/user';
        await axios.post(url, newUserData)
          .then(res => {
            // console.log(res);
            alert(res.data);
          })
          .catch(error => console.log(error)); 

        // Logging out and sent to sign in page
        signOut(auth)
          .then(() => {
            router.push('/log-in');
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
        alert("invalid username and password");
      });
  }

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
          width: { md: "55%" },
          display: { xs: "none", md: "block" }, 
          backgroundImage: 'url("/tokyo.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "16px 0 0 16px", 
        }}
        src="/tokyo.jpg"
      />
    <Paper
        elevation={3}
        sx={{
          padding: 5,
          height: "70vh",
          overflow: 'auto', 
          width: { xs: "100%", md: "45%" },
          maxWidth: "500px",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          '&::-webkit-scrollbar': {
            width: "15px"
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
          }
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Create Account
        </Typography>
        <GoogleLogIn />
        <Typography sx={{ textAlign: "center", my: 2 }}>
          ----------------------------or---------------------------------
        </Typography>
    <Box component="form" onSubmit={passwordSignUp} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
      <TextField
        label="First Name"
        type="text"
        placeholder="Enter your first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Last Name"
        type="text"
        placeholder="Enter your last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon />
            </InputAdornment>
          ),
        }}
      />
       <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
            textTransform: "none",
            width: "100%",
            height: "56px",
            borderRadius: "4px", 
          }}
        >Sign Up</Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Typography>Already have an account?</Typography>
      <Link href="/log-in">
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
              Log in here
            </Typography></Link>
    </Box>
  </Paper> </Box>
);
}