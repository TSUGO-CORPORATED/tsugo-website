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
    const [userUid, setUserUid] = useState<string>('noUid');
    const [userFirstName, setUserFirstName] = useState<string>('noFirstName');
    const [userLastName, setUserLastName] = useState<string>('noLastName');

    return (
        <ContextVariables.Provider value={{userId, userUid, userFirstName, userLastName, setUserId, setUserUid, setUserFirstName, setUserLastName}}>
            <body className={`${inter.className}`}>
                <div className='navbar-layout'><Navbar /></div>
                <div className='childrenprops-layout'>{props.childrenProp}</div>
            </body>
        </ContextVariables.Provider>
    )
}