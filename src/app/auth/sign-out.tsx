'use client';

// IMPORT MODULES
import { signOut } from 'firebase/auth';
import { auth } from "../../firebase";
import { useRouter } from 'next/navigation'

// PAGE COMPONENT
export default function SignOut() {
  const router = useRouter();
  
  function userSignOut(): void {
    signOut(auth)
      .then(() => {
        alert('sign out successful');
        router.push('/');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <button onClick={userSignOut} className='sign-out__button'>Sign Out</button>
  )
}