'use client';

import { auth } from '../../firebase';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button';

export default function GoogleLogIn(): JSX.Element {
    const router = useRouter();
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();

    async function googleSignUp(): Promise<void> {
        console.log('test')


    
        signInWithPopup(auth, provider)
          .then(async (result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential ? credential.accessToken : null;
    
            // IdP data available using getAdditionalUserInfo(result)
            // ...
    
            // The signed-in user info.
            const user: User = result.user;
            // console.log(user);
            
    
            // If account is new, register to server 
            // const url1: string = `http://localhost:8080/user/check/${user.email}`;
            const url1: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/user/check/${user.email}`;
            const checkUserAvailability: boolean = await axios.get(url1).then(res => res.data);
            if (!checkUserAvailability) {
              // Registering user to the backend
              const firstName = user.displayName?.split(" ", 2)[0];
              const lastName = user.displayName?.split(" ", 2)[1];
              
              const newUserData = {
                uid: user.uid,
                email: user.email,
                firstName: firstName,
                lastName: lastName,
              };
      
              // const url2: string = 'http://localhost:8080/user';
              const url2: string = 'https://senior-project-server-8090ce16e15d.herokuapp.com/user';
              await axios.post(url2, newUserData)
                .then(res => {
                  // console.log(res);
                  alert(res.data);
                })
                .catch(error => console.log(error)); 
            }
    
            router.push('/dashboard');
    
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    return (
      <Button
      variant="contained"
      startIcon={
          <img 
              src="/google-icon-2048x2048-czn3g8x8.png" 
              alt="Google sign-in" 
              style={{ width: 24, height: 24 }} 
          />
      }
      onClick={googleSignUp}
      sx={{
          backgroundColor: 'white', 
          color: 'black', 
          '&:hover': {
              backgroundColor: '#eeeeee', 
          },
          textTransform: 'none', 
          width: '100%',
          justifyContent: 'flex-start', 
      }}
  >
      Sign up with Google
  </Button>
    )
}