'use client';

// MODULES IMPORT
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

// PAGE COMPONENT
export default function HomeRedirect(): JSX.Element {
    const router = useRouter();
    return (
        <div className='landingpage'>
            <div className='landingpage__card'>
                <h1 className='landingpage__header'>Welcome to Tsugo</h1>
                <video className='landingpage__video' autoPlay loop muted playsInline controls={false}>
                    <source src='/videos/tokyo.mp4' />
                    Your browser does not support the video tag.
                </video>
                <Link href="/log-in" className='sign-up__card__log-in-link'><button className='home-page__login__div'>Log In</button></Link>
            </div>
        </div>
    )
}