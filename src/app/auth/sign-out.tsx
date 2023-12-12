'use client';

// IMPORT MODULES
import { signOut } from 'firebase/auth';
import { auth } from "../../firebase";
import { ContextVariables } from '../../context-variables';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';

// PAGE COMPONENT
export default function SignOut() {
  // CONTEXT VARIABLE
  const { setUserId, setUserUid, setUserFirstName, setUserLastName, setUserEmail, setUserPhotoUrl } = useContext(ContextVariables);
  const router = useRouter();

  // HELPER FUNCITON
  function userSignOut(): void {
    signOut(auth)
      .then(() => {
        // Reset context variables
        setUserId(0);
        setUserUid('noUid');
        setUserFirstName('noFirstName');
        setUserLastName('noLastName');
        setUserEmail('noEmail');
        setUserPhotoUrl('noPhotoUrl');

        // alert('sign out successful');

        // push to homepage
        router.push('/');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div onClick={userSignOut}>Sign Out</div>
  )
}