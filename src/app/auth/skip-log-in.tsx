'use client'

import { useEffect } from 'react';
import { auth } from "../../firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation'


export default function SkipLogIn() {
  const router = useRouter();

  useEffect(() => {
    // console.log(auth);
    if (auth.currentUser) router.push('/dashboard');

    // This is a broken feature applied as it keeps listening to log in, interfering with sign up
    // const listen = onAuthStateChanged(auth, (user: any) => {
    //   console.log(user);
    //   if (user) router.push('/dashboard');
    // });
    // return () => {
    //   listen();
    // }
      // this unmount the listen function so that it does not have to be run twice
  }, []);


  return (
    <></>
  )
}