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
        <div>
        <div className='profile-container'>
            <h1>User Profile</h1>
            <p>ID: {userId}</p>
            <p>First Name: {userFirstName}</p>
            <p>Last Name: {userLastName}</p>
            <p>Language:</p>
        </div>
        <button>edit</button>
        <button>delete</button>

        <button>help/supprot</button>
        <button>Agreement</button>
        </div>
    );
}