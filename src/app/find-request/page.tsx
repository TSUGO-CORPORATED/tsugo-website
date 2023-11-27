// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import Link from 'next/link';
import FindRequest from './check-appointment';


// PAGE NAME
export const metadata: Metadata = {
    title: 'Translator',
}

// PAGE COMPONENT
export default async function findRequest() {
    return (
        <div className='find_Header'>
            {/* <Link href="/dashboard">
                <button>Home</button>
            </Link> 
            <Link href="/profile">
                <button>Profile</button>
            </Link>
            <SignOut />  */}
            <FindRequest />

        </div>
    )
}