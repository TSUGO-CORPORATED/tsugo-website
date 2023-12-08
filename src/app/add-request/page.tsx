// MODULES IMPORT
import { Metadata } from 'next';
import CreateAppointment from './create-appointment'
import CheckAuth from '../auth/check-auth';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Tsugo',
}

// PAGE COMPONENT
export default async function requestAppointment() {
    return (
        <div className='add-request'>
            <CheckAuth />
            <CreateAppointment />
        </div>
    )
}