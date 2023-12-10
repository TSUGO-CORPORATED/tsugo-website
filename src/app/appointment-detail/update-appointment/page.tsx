// MODULES IMPORT
import { Metadata } from 'next';
import UpdateAppointmentCard from './update-appointment-card';
import CheckAuth from '@/app/auth/check-auth';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Update Apppointment',
}

// PAGE COMPONENT
export default function UpdateAppointment(): JSX.Element {
    return (
        <div className="update-appointment">
            <CheckAuth />
            <UpdateAppointmentCard />
        </div>
    )
}