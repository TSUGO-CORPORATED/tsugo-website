'use client';

// MODULES IMPORT
import { MyContext } from '../../MyContext';
import { useContext } from 'react';

// PAGE COMPONENT
export default function DashboardCard(): JSX.Element {
    const { userId, userEmail, userFirstName, userLastName } = useContext(MyContext);
    console.log(userId, userEmail, userFirstName, userLastName);
    return (
        <></>
    )
}