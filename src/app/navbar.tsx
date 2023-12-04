import React, {useContext} from 'react';
import SignOut from './auth/sign-out';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import profilePic from './../../public/default.jpg';
import { ContextVariables } from '@/context-variables';

export default function Navbar() {
    const pathname = usePathname();
    // console.log(pathname)
    const { userPhotoUrl } = useContext(ContextVariables);

    return (
        <>
            {pathname === '/' || pathname === '/log-in' || pathname === '/sign-up' ? (
                <ul className='navbar-ul'>
                    <li className='logo-navbar'>
                        <Link href="/">
                            <div>Tsugo/都合</div>
                        </Link>
                    </li> 
                    <li className='navbar-li'><Link href="/log-in" className='logout-navbar'>
                            <div>Log in</div>
                        </Link>
                    </li>
                    <li className='profile-navbar'>
                        <Link href="/sign-up">
                            <div>Sign up</div>
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul className='navbar-ul'>
                    <li className='logo-navbar'>
                        <Link href="/dashboard">
                            <div>Tsugo/都合</div>
                        </Link>
                    </li> 

                    <li className='avatar-navbar'>
                        <div>
                        <Image 
                            src={profilePic}
                            alt='Avatar'
                            className='navbar-avatar'
                            width={20}
                            height={20}
                        />  
                        </div>
                    </li>
                    
                    <li className='navbar-li'><Link href="/log-in" className='logout-navbar'>
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