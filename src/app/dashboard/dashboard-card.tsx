'use client';

// MODULES IMPORT
import { ContextVariables } from '../../context-variables';
import { useContext } from 'react';

// PAGE COMPONENT
export default function DashboardCard(): JSX.Element {
    const { userId, userEmail, userFirstName, userLastName } = useContext(ContextVariables);
    console.log(userId, userEmail, userFirstName, userLastName);
    return (
        <></>
    )
}