'use client';

// IMPORT MODULES
import { ContextVariables } from '../context-variables';
import { useState } from 'react';
import { inter } from '@/fonts';
//import ResponsiveAppBar from './responsive-app-bar';
import Navbar from './navbar';

// DATA TYPE
interface Props {
    childrenProp: React.ReactNode;
}

// PAGE COMPONENT
export default function LayoutSub(props: Props): JSX.Element {
    const [userId, setUserId] = useState<number>(0);
    const [userEmail, setUserEmail] = useState<string>('testEmail');
    const [userFirstName, setUserFirstName] = useState<string>('testFirstName');
    const [userLastName, setUserLastName] = useState<string>('testLastName');

    return (
        <ContextVariables.Provider value={{userId, userEmail, userFirstName, userLastName, setUserId, setUserEmail, setUserFirstName, setUserLastName}}>
            <body className={`${inter.className}`}>
                <div className='navbar-layout'><Navbar /></div>
                <div className='childrenprops-layout'>{props.childrenProp}</div>
            </body>
        </ContextVariables.Provider>
    )
}