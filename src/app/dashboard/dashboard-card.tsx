'use client';

// MODULES IMPORT
import { useContext } from 'react';
// import style from '../../../css/_dashboardcard.scss'; 
import { ContextVariables } from '../../context-variables';

// PAGE COMPONENT
export default function DashboardCard(): JSX.Element {
    const { userId, userFirstName, userLastName } = useContext(ContextVariables);
    console.log(userId, userFirstName, userLastName);
    return (
    <> 
    <div className="dashboard-card">
        <p>Welcome, {userFirstName} {userLastName}!</p>
    </div></>
    )
}