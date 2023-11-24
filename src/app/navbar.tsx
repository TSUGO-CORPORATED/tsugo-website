import React from 'react';

export default function Navbar() {
    return (
        <ul>
            <li><a href='logo-navbar' className='logo-navbar'>Tsugo</a></li>
            <li><a href='logout-navbar' className='logout-navbar'>Logout</a></li>
            <li><a href='profile-navbar' className='profile-navbar'>Profile</a></li>
        </ul>
    )
}