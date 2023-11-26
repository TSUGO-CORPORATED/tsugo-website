'use client';

// IMPORT MODULES
import { signOut } from 'firebase/auth';
import { auth } from "../../firebase";
import { useRouter } from 'next/navigation';
import { ContextVariables } from '../../context-variables';
import { useContext } from 'react';



// PAGE COMPONENT
export default function SignOut() {
  const router = useRouter();
  const { setUserId, setUserUid, setUserFirstName, setUserLastName } = useContext(ContextVariables);
  
  function userSignOut(): void {
    signOut(auth)
      .then(() => {
        // Reset context variables
        setUserId(0);
        setUserUid('noUid');
        setUserFirstName('noFirstName');
        setUserLastName('noLastName');

        alert('sign out successful');
        router.push('/log-in');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <button onClick={userSignOut} className='sign-out__button'>Sign Out</button>
  )
}