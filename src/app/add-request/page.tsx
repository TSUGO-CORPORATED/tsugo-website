// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import UserClientAppointment from './create-appointment'
import Link from 'next/link';


// PAGE NAME
export const metadata: Metadata = {
    title: 'add-request',
}

// PAGE COMPONENT
export default async function requestAppointment() {
    return (
        <div className='requestHeader'>
            {/* <Link href="/dashboard">
                <button>Home</button>
            </Link> 
            <Link href="/profile">
                <button>Profile</button>
            </Link>
            <SignOut />  */}
            <UserClientAppointment />

        </div>
    )
}