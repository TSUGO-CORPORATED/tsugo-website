'use client';

// MODULES IMPORT
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import axios from 'axios';
import GoogleLogIn from '../auth/google-log-in';
import { TextField,Divider, Button, Typography, Paper, Box, InputAdornment} from '@mui/material';
import SignUpForm from './sign-up-form';
import SignUp from './page';
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
export default function SignUpCard(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  // const [randomImage, setRandomImage] = useState('')
  // const [loading, setLoading] = useState(true);

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

  async function passwordSignUp(e: any): Promise<void> {
    e.preventDefault();
      // this prevents the email and password to dissapear when button is clicked, achieved by removing default
    
    // Guard function, abort function if account is already registered
    // const url: string = `http://localhost:8080/user/check/${email}`;
    const url: string = `${process.env.NEXT_PUBLIC_DATABASE_SERVER_URL}/user/check/${email}`;
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
        // alert("Create user successful in firebase");

        // Registering user to the backend
        const newUserData = {
          uid: userCredintial.user.uid,
          email: email,
          firstName: firstName,
          lastName: lastName,
        };
        // const url: string = 'http://localhost:8080/user';
        const url: string = `${process.env.NEXT_PUBLIC_DATABASE_SERVER_URL}/user`;
        await axios.post(url, newUserData)
          .then(res => {
            // console.log(res);
            // alert(res.data);
            alert("Account successfully created, please log-in");
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


  // if (loading) {
  //   return <CircularProgress />; 
  // }    
  return (
    <Box
      sx={{
        display: "flex",
        // overflow: "hidden",
        justifyContent: "center",
        borderRadius: "16px",
        alignItems: "center",
        width: { xs: "90%", md: "1000px" },
        height: { xs: "auto", md: "65vh" },
        margin: "0 auto",
        flexDirection: { xs: "column", md: "row" }, 
      }}
      data-testid='cardContainer'
    >
      <Box
        component="img"
        sx={{
          display: { xs: "none", md: "block" },
          width: { md: "50%" },
          height: { md: "100%" },
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "16px 0 0 16px", 
        }}
        src='/logo.png'
        data-testid='logo'
      />
      <Box
        // elevation={3}
        sx={{
          padding: 3,
          paddingTop: { xs: 2, md: 2 }, 
          height: {xs: '72vh', md: '65vh'},
          overflow: 'auto', 
          width: { xs: "100%", md: "45%" },
          borderRadius: { xs: "16px", md: "0 16px 16px 0" },
          border: 1,
          borderColor: '#e0e0e0',
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          // '&::-webkit-scrollbar': {
          //   width: "15px"
          // },
          // '&::-webkit-scrollbar-track': {
          //   boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          //   webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          // },
          // '&::-webkit-scrollbar-thumb': {
          //   backgroundColor: 'rgba(0,0,0,.1)',
          //   outline: '1px solid slategrey'
          // }
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ textAlign: "center", mb: 2, mt: { xs: 1, md: 1 }, fontSize: {xs: "30px", md: "34px"} }}
          data-testid='heading'
        >
          Create Account
        </Typography>
        <GoogleLogIn />
        <Divider sx={{ my: 2 }} />
        <SignUpForm handleSubmit={passwordSignUp} email={email} password={password} firstName={firstName} lastName={lastName} setEmail={setEmail} setPassword={setPassword} setFirstName={setFirstName} setLastName={setLastName}/>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography data-testid='haveAccountText'>Already have an account?</Typography>
          <Link href="/log-in" data-testid='logInLink'>
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
              Log in
            </Typography>
          </Link>
        </Box>
      </Box> 
    </Box>
  );
}