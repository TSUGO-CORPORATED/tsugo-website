// MODULES IMPORT
import { Metadata } from 'next';
import DashboardCard from './dashboard-card';
import CheckAuth from '../auth/check-auth';


// PAGE NAME
export const metadata: Metadata = {
    title: 'Tsugo',
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