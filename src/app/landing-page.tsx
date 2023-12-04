'use client';

// MODULES IMPORT
import Link from 'next/link';
import React from 'react';

// PAGE COMPONENT
export default function LandingPage(): JSX.Element {
    return (
        <div className='home__landing-page'>
            <h1 className='home__landing-page__header'>Welcome to Tsugo</h1>
            <video className='home__landing-page__video' autoPlay loop muted playsInline controls={false}>
                <source src='/videos/tokyo.mp4' />
                Your browser does not support the video tag.
            </video>
            <Link href="/log-in" className='home__landing-page__log-in-link'><button className='home-page__login__div'>Log In</button></Link>
        </div>
    )
}