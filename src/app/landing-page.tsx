'use client';

// MODULES IMPORT
import Link from 'next/link';
import React from 'react';
import { Button } from '@mui/material';
import { buttonOffLight } from '@/muistyle';

// PAGE COMPONENT
export default function LandingPage(): JSX.Element {
    return (
        <div className='home__landing-page'>
            <div className='home__landing-page__header-group'>
                <h1 className='home__landing-page__header-group__text'>Welcome</h1>
                <h1 className='home__landing-page__header-group__text'> to </h1>
                <h1 className='home__landing-page__header-group__text'>Tsugo</h1>
            </div>
            <Link href="/log-in" className='home__landing-page__log-in-link'><Button variant='contained' sx={buttonOffLight} className='home-page__login__div'>Get Started</Button></Link>
            <video className='home__landing-page__video' autoPlay loop muted playsInline controls={false}>
                <source src='/videos/tokyo.mp4' />
                Your browser does not support the video tag.
            </video>
            
        </div>
    )
}