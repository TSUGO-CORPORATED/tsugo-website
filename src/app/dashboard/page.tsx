// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import DashboardCard from './dashboard-card';
import DashboardTabs from './dashboard-tabs'
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
            {/* <Link href="/dashboard">
                <button>Home</button>
            </Link> 
            <Link href="/profile">
                <button>Profile</button>
            </Link> */}
            
            <DashboardCard />
            {/* <SignOut />  */}
        </div>
    )
}