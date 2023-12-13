'use client';

// MODULES IMPORT
import Link from 'next/link';
import React from 'react';
import { Button } from '@mui/material';
import { buttonOffLight } from '@/muistyle';
import Box from '@mui/material/Box';

// PAGE COMPONENT
export default function LandingPage(): JSX.Element {
    return (
        <div className='home__landing-page'>
            <div className='home__landing-page__header-group'>
                <h1 className='home__landing-page__header-group__text' id='home__landing-page__header__text__welcome'>Welcome</h1>
                <h1 className='home__landing-page__header-group__text' id='home__landing-page__header__text__to'> to </h1>
                <h1 className='home__landing-page__header-group__text' id='home__landing-page__header__text__tsugo'>Tsugo</h1>
            </div>
            <p className='home__landing-page__slogan'>Where Connections Blossom - Making Language Support Always "Tsugo" for You!</p>
            {/* <Box
                component='img'
                src='/logo2.png'
                sx={{
                    borderRadius: '50%',
                    position: 'absolute',
                    height: {
                        xs: '20%',
                        md: '30%'
                    },
                    width: {
                        xs: '20%',
                        md: '30%'
                    }
                }}
            /> */}
            <Link href="/log-in" className='home__landing-page__log-in-link'><Button variant='contained' sx={buttonOffLight}><p className='home-page__login__div'>Get Started</p></Button></Link>
            <video className='home__landing-page__video' autoPlay loop muted playsInline controls={false}>
                <source src='/videos/sakura.mp4' />
                Your browser does not support the video tag.
            </video>
            
        </div>
    )
}