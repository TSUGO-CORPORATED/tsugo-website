// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';
import DashboardCard from './dashboard-card';
import DashboardTabs from './dashboard-tabs'



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
            <SignOut />
        </div>
    )
}