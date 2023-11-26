// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import Profile from './profile-components'
import Link from 'next/link';


// PAGE NAME
export const metadata: Metadata = {
    title: 'Profile',
}

// PAGE COMPONENT
export default async function ProfilePage() {
    return (
        <div className='profile'>
            <div className='profile_header'>
                <Link href="/dashboard">
                    <button>Home</button>
                </Link> 
                <Link href="/profile">
                    <button>Profile</button>
                </Link>
                <SignOut /> 
                <Profile />
            </div>
        </div>
    )
}