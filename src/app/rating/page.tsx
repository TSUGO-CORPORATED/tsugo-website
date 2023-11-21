// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import Link from 'next/link';
import Rating from './rating-components'


// PAGE NAME
export const metadata: Metadata = {
    title: 'Rating',
}

// PAGE COMPONENT
export default async function Rating_page() {
    return (
        <div className='profile_header'>
            <Link href="/dashboard">
                <button>Home</button>
            </Link> 
            <Link href="/profile">
                <button>Profile</button>
            </Link>
            <SignOut /> 
            <Rating />

        </div>
    )
}