// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import Conformation from './conformation'
import Link from 'next/link';


// PAGE NAME
export const metadata: Metadata = {
    title: 'Conformation',
}

// PAGE COMPONENT
export default async function ConformationPage() {
    return (
        <div className='profile_header'>
            <Link href="/dashboard">
                <button>Home</button>
            </Link> 
            <Link href="/profile">
                <button>Profile</button>
            </Link>
            <SignOut /> 
            <Conformation />

        </div>
    )
}