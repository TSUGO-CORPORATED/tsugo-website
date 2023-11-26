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
        router.push('/log-in');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div onClick={userSignOut}>Sign Out</div>
  )
}