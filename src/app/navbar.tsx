import React from 'react';
import SignOut from './auth/sign-out';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import profilePic from './../../public/Mark.jpg';


export default function Navbar() {
    const pathname = usePathname();
    // console.log(pathname)
    return (
            <>
                {pathname === '/' || pathname === '/log-in' || pathname === '/sign-up' ? (
                    <div className='navbar'>
                        <div className='navbar__left'>
                            <Link href="/" className='navbar__left__logo'>Tsugo/都合</Link>
                        </div>
                        <div className='navbar__right'>
                            <Link href="/sign-up" className='navbar__right__sign-up'>Sign up</Link>
                            <Link href="/log-in" className='navbar__right__log-in'>Log in</Link>
                        </div>
                    </div>
                ) : (
                    <div className='navbar'>
                        <div className='navbar__logo-navbar'>
                            <Link href="/dashboard">
                                <div>Tsugo/都合</div>
                            </Link>
                        </div> 

                        <div className='navbar__avatar-navbar'>
                            <div>
                            <Image 
                                src={profilePic}
                                alt='Avatar'
                                className='navbar__navbar-avatar'
                                width={20}
                                height={20}
                            />  
                            </div>
                        </div>
                        
                        <div className='navbar__navbar-li'>
                            <Link href="/log-in" className='navbar__logout-navbar'>
                                <div><SignOut /></div>
                            </Link>
                        </div>

                        <div className='navbar__profile-navbar'>
                            <Link href="/profile">
                                <div>Profile</div>
                            </Link>
                        </div>
                    </div>
                )}
            </>
    )
}