import React from 'react';
import SignOut from './auth/sign-out';
import Link from 'next/link';

export default function Navbar() {
    return (
        <ul>
            <li><a href='logo-navbar' className='logo-navbar'>
                <Link href="/dashboard">
                    Tsugo/都合
                </Link>
                </a>
            </li> 
            
            <li><a href='logout-navbar' className='logout-navbar'>
                    <SignOut />
                </a>
            </li>
            <li><a href='profile-navbar' className='profile-navbar'>
                <Link href="/profile">
                    Profile
                </Link>
                </a>
            </li>
        </ul>
    )
}