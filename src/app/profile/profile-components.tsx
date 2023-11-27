'use client';
import React, { useContext } from 'react';
import { ContextVariables } from '../../context-variables';
import axios from "axios"
import Link from 'next/link';

export default function Profile() {
    const { userId, userFirstName, userLastName } = useContext(ContextVariables);

    //Fetch User Rating from backend Maybe Divide Translator rating /Client Rating?
    // useEffect(() => {
    // }, []);

    // const updateUser = async () => {
    //     try {const response = await axios.post('/api/update-user', {
    //             userId, 
    //             userEmail, 
    //             userFirstName, 
    //             userLastName
    //         });
    //     } catch (error) {
    //     }
    // }

    return (
        
        <div className='profile-container'>
            <h1 className='profile-header'>User Profile</h1>
            <p className='profile-p'>ID: {userId}</p>
            <p className='profile-p'>First Name: {userFirstName}</p>
            <p className='profile-p'>Last Name: {userLastName}</p>
            <p className='profile-p'>Language:</p>
        
            <button className='profile-button'>edit</button>
            <button className='profile-button'>delete</button>
            <button className='profile-button'>help/supprot</button>
            <button className='profile-button'>Agreement</button>
        </div>
    );
}