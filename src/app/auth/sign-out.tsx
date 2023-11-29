'use client';

// IMPORT MODULES
import { signOut } from 'firebase/auth';
import { auth } from "../../firebase";
import { ContextVariables } from '../../context-variables';
import { useContext } from 'react';



// PAGE COMPONENT
export default function SignOut() {
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
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div onClick={userSignOut}>Sign Out</div>
  )
}