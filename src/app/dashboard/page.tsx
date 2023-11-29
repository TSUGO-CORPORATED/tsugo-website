// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import DashboardCard from './dashboard-card';
import Link from 'next/link';
import CheckAuth from '../auth/check-auth';


// PAGE NAME
export const metadata: Metadata = {
    title: 'Dashboard',
}

// PAGE COMPONENT
export default async function Dashboard() {
    return (
        <div className='dashboard'>
            <CheckAuth />
            <DashboardCard />
        </div>
    )
}