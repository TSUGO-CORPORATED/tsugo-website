import React from 'react';
import SignOut from './auth/sign-out';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    console.log(pathname)
    return (
        <>
            {pathname === '/' || pathname === '/log-in' || pathname === '/sign-up' ? (
                <ul>
                    <li className='logo-navbar'>
                        <Link href="/">
                            <div>Tsugo/都合</div>
                        </Link>
                    </li> 
                    <li><Link href="/log-in" className='logout-navbar'>
                            <div>Log in</div>
                        </Link>
                    </li>
                    <li className='profile-navbar'>
                        <Link href="/sign-up">
                            <div>Register</div>
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li className='logo-navbar'>
                        <Link href="/dashboard">
                            <div>Tsugo/都合</div>
                        </Link>
                    </li> 
                    
                    <li><Link href="/log-in" className='logout-navbar'>
                            <div><SignOut /></div>
                        </Link>
                    </li>
                    <li className='profile-navbar'>
                        <Link href="/profile">
                            <div>Profile</div>
                        </Link>
                    </li>
                </ul>
            )}
        </>
    )
}