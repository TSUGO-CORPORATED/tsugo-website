'use client';

import { useEffect, useContext } from 'react';
import { auth } from "../../firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ContextVariables } from '../../context-variables';
import axios from 'axios';
import { usePathname } from 'next/navigation';

export default function CheckAuth(): JSX.Element {
  const router = useRouter();
  const { userUid, setUserId, setUserUid, setUserFirstName, setUserLastName, setUserEmail, setUserPhotoUrl } = useContext(ContextVariables);
  const pathname = usePathname();
  // const { userId, userFirstName, userLastName, userPhotoUrl } = useContext(ContextVariables);

  // function checkCurrentUser() {
  //   console.log(userId, userFirstName, userLastName, userPhotoUrl);
  //   console.log(auth.currentUser);
  // }

  useEffect(() => {
    // Check if user is log-ed in. If not, return to sign in. If yes, assign context variable
    const listen = onAuthStateChanged(auth, async (user: any) => {
      // console.log(user);
      if (user && userUid === 'noUid') {
        // Apply use context variable if user is log in and context variable is not assigned yet 

        // Retrieve user data from backend database
        // const url: string = `http://localhost:8080/user/${user.uid}`;
        const url: string = `${process.env.NEXT_PUBLIC_DATABASE_SERVER_URL}/user/${user.uid}`;
        const userData = await axios.get(url);
        // console.log(userData);

        // Assign to global variables
        setUserId(userData.data.id);
        setUserUid(user.uid);
        setUserFirstName(userData.data.firstName);
        setUserLastName(userData.data.lastName);
        setUserEmail(user.email);
        if (user.photoURL) setUserPhotoUrl(user.photoURL);
      } else if (!user) {
        // Redirect to sign in if there is no log in, unless if it is in homepage
        if (pathname !== '/') router.push("/log-in");
      }
    });

    return () => {
      listen();
    }
      // this unmount the listen function so that it does not have to be run twice
  }, []);


  return (
    <>
      {/* <button onClick={checkCurrentUser}>Check Current User</button> */}
    </>
  )
}