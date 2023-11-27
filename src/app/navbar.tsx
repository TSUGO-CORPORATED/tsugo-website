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
            
            <li><a href='logout-navbar' className='logout-navbar'>
                    <div><SignOut /></div>
                </a>
            </li>
            <li className='profile-navbar'>
                <Link href="/profile">
                    <div>Profile</div>
                </Link>
            </li>
        </ul>
    )
}