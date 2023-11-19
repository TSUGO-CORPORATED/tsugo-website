// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import DashboardCard from './dashboard-card';


// PAGE NAME
export const metadata: Metadata = {
    title: 'Dashboard',
}

// PAGE COMPONENT
export default async function Dashboard() {
    return (
        <div className='dasboard'>
            <div>Dashboard</div>
            <DashboardCard />
            <SignOut />
        </div>
    )
}