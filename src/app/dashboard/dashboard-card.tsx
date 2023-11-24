'use client';

// MODULES IMPORT
import { useContext } from 'react';
// import style from '../../../css/_dashboardcard.scss'; 
import { ContextVariables } from '../../context-variables';
import DashboardTabs from './dashboard-tabs';

// PAGE COMPONENT
export default function DashboardCard(): JSX.Element {

    const { userId, userFirstName, userLastName } = useContext(ContextVariables);
    console.log(userId, userFirstName, userLastName);

    return (
        <div className="dashboard-card">
            <div className='dashboard-card-card'>
                <h1>Welcome, {userFirstName} {userLastName}!</h1>
                <DashboardTabs />
            </div>
        </div>
    )
}