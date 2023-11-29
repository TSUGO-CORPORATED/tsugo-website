// MODULES IMPORT
import { Metadata } from 'next';
import CheckAuth from '../auth/check-auth';
import Link from 'next/link';
import AppointmentDetailCard from './appointment-detail-card';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Appointment Detail',
}

// PAGE COMPONENT
export default async function AppointmentDetail() {
    return (
        <div className='appointment-detail'>
            <CheckAuth />
            <AppointmentDetailCard />
        </div>
    )
}