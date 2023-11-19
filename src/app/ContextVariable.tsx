'use client';

// IMPORT MODULES
import { MyContext } from '../MyContext';
import { useState } from 'react';
import { inter } from '@/fonts';

// DATA TYPE
interface Props {
    childrenProp: React.ReactNode;
}

// PAGE COMPONENT
export default function ContextVariable(props: Props): JSX.Element {
    const [userId, setUserId] = useState<number>(0);
    const [userEmail, setUserEmail] = useState<string>('testEmail');
    const [userFirstName, setUserFirstName] = useState<string>('testFirstName');
    const [userLastName, setUserLastName] = useState<string>('testLastName');

    return (
        <MyContext.Provider value={{userId, userEmail, userFirstName, userLastName, setUserId, setUserEmail, setUserFirstName, setUserLastName}}>
            <body className={`${inter.className}`}>{props.childrenProp}</body>
        </MyContext.Provider>
    )
}