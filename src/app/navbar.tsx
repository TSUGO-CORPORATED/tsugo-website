import React from 'react';
import SignOut from './auth/sign-out';
import Link from 'next/link';

export default function Navbar() {
    return (
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
    )
}