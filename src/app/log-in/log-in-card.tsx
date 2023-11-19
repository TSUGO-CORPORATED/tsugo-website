'use client';

// MODULES IMPORT
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



// PAGE COMPONENT
export default function LogInCard(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();

  async function logIn(e: any): Promise<void> {
    e.preventDefault();
      // this prevents the email and password to dissapear when button is clicked, achieved by removing default

    const response: string | void | null = await signInWithEmailAndPassword(auth, email, password)
      .then((userCredintial) => {
        // console.log(userCredintial);
        // console.log(userCredintial.user.email);
        return userCredintial.user.email;
      })
      .catch((error) => {
        console.log(error);
      });
      // this will send email and password to firebase. If correct it will return user email
    // console.log(response);
    
    if (response) {
      alert('Successful login');
      router.push('/dashboard');
    } 
    else alert('Invalid username or password');
  }

  return (
    <div className='log-in__card'>
      <h1 className='log-in__card__title'>Log In to Your Account</ h1>
      <form onSubmit={logIn} className='log-in__card__form'>
        <div className='log-in__card__form__box'>
          <label className='log-in__card__form__box__label'>Email</label>
          <input 
            type="email" 
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value) }
            className='log-in__card__form__box__input'
            required
          ></input>
        </div>
        <div className='log-in__card__form__box'>
          <label className='log-in__card__form__box__label'>Password</label>
          <input 
            type="password" 
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value) }
            className='log-in__card__form__box__input'
            required
          ></input>
        </div>
        <button type="submit" className='log-in__card__form__box__log-in-button'>Log In</button>
      </form>
      <div className='log-in__card__sign-up'>
        <p className='log-in__card__sign-up__text'>Don't have an account?</p>
        <Link href="/sign-up"><p className='log-in__card__sign-up__link'>Sign Up</p></Link>
      </div>
    </div>
  )
};