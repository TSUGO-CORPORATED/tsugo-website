// MODULES IMPORT
import { Metadata } from 'next';
import UserClientAppointment from './create-appointment'
import CheckAuth from '../auth/check-auth';

// PAGE NAME
export const metadata: Metadata = {
    title: 'add-request',
}

// PAGE COMPONENT
export default async function requestAppointment() {
    return (
        <div className='requestHeader'>
            <CheckAuth />
            <UserClientAppointment />
        </div>
    )
}