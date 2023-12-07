// MODULES IMPORT
import { Metadata } from 'next';
import CheckAuth from '../auth/check-auth';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Tsugo',
}

// PAGE COMPONENT
export default async function AppointmentDetail() {
    return (
        <div className='appointment-detail'>
            <CheckAuth />
        </div>
    )
}