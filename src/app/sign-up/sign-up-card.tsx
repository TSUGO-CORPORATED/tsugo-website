'use client';

// MODULES IMPORT
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import axios from 'axios';


// DATA TYPE INTERFACES
interface Language {
  language: string,
  proficiency: string,
  certifications?: string,
}

// PAGE COMPONENT
export default function SignUpCard(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);

  const router = useRouter();
  const provider = new GoogleAuthProvider();

  async function passwordSignUp(e: any) {
    e.preventDefault();
      // this prevents the email and password to dissapear when button is clicked, achieved by removing default

    auth.useDeviceLanguage();

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
          languages: languages,
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

  async function googleSignUp() {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential ? credential.accessToken : null;

        // IdP data available using getAdditionalUserInfo(result)
        // ...

        // The signed-in user info.
        const user = result.user;
        console.log(user);
        


        // Registering user to the backend
        const newUserData = {
          uid: user.uid,
          email: user.email,
          firstName: user.displayName,
          lastName: user.displayName,
          languages: languages,
        };
        // const url: string = 'http://localhost:8080/user';
        const url: string = 'https://senior-project-server-8090ce16e15d.herokuapp.com/user';
        await axios.post(url, newUserData)
          .then(res => {
            // console.log(res);
            alert(res.data);
          })
          .catch(error => console.log(error)); 

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
    <div className='sign-up__card'>
        <h1 className='sign-up__card__title'>Create Account</h1>
        <form onSubmit={passwordSignUp} className='sign-up__card__form'>
          <div className='sign-up__card__form__box'>
              <label className='sign-up__card__form__box__label'>Email</label>
              <input 
              type="email" 
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value) }
              className='sign-up__card__form__box__input'
              required
              ></input>
          </div>
          <div className='sign-up__card__form__box'>
              <label className='sign-up__card__form__box__label'>Password</label>
              <input 
              type="password" 
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value) }
              className='sign-up__card__form__box__input'
              required
              ></input>
          </div>
          <div className='sign-up__card__form__box'>
              <label className='sign-up__card__form__box__label'>First Name</label>
              <input 
              type="text" 
              placeholder='Enter your first name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value) }
              className='sign-up__card__form__box__input'
              required
              ></input>
          </div>
          <div className='sign-up__card__form__box'>
              <label className='sign-up__card__form__box__label'>Last Name</label>
              <input 
              type="text" 
              placeholder='Enter your last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value) }
              className='sign-up__card__form__box__input'
              required
              ></input>
          </div>
          <button type="submit" className='sign-up__card__form__box__sign-up-button'>Sign up</button>
        </form>
        <div>
          <p>Already have an account?</p>
          <Link href="/log-in" className='sign-up__card__log-in-linka'><p>Log in here.</p></Link>
        </div>
        <div>---------------or----------------</div>
        <div onClick={googleSignUp}>Sign up with Google</div>
    </div>
  )
}