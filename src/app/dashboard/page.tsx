// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import DashboardCard from './dashboard-card';
import DashboardTabs from './dashboard-tabs'
import Link from 'next/link';


// PAGE NAME
export const metadata: Metadata = {
    title: 'Dashboard',
}

// PAGE COMPONENT
export default async function Dashboard() {
    return (
        <div className='dasboard'>
            <DashboardCard />
            <DashboardTabs />
            <Link href="/history">
                <button>History</button>
            </Link>
            <Link href="/profile">
                <button>Profile</button>
            </Link>
            <SignOut />
        </div>
    )
}