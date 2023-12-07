'use client';
import React, { useContext, useEffect, useState } from 'react';
import { ContextVariables } from '../../context-variables';
import axios from "axios"
import Link from 'next/link';
import Image from 'next/image';
import { TextField, Button, Paper } from '@mui/material';

import profilePic from '../../../public/default.jpg';

import { auth } from "../../firebase";


export default function Profile() {
    interface UserDetails{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        profilePicture: Buffer | null;
        about: string | null;
        userLanguage: UserGetDetailLanguage[];
    }

    interface UserGetDetailLanguage {
        id: number,
        language: string,
        proficiency: string,
        certifications?: string | null,
      }

    const url: string = 'https://senior-project-server-8090ce16e15d.herokuapp.com/user/';
    const { userId, userFirstName, userLastName, userUid } = useContext(ContextVariables);
    const [userProfile, setUserProfile] = useState<UserDetails | null>();
    const [updated, setUpdated] = useState<Boolean>(false);
    const [firstNameUpdate, setFirstNameUpdate] = useState<string | number | readonly string[] | undefined>("");
    const [lastNameUpdate, setLastNameUpdate] = useState<String|undefined|null>(userProfile?.lastName);
    const [aboutUpdate, setAboutUpdate] = useState<String|undefined|null>(userProfile?.about);

    const [languageUpdate, setLanguageUpdate] = useState<string | number | readonly string[] | undefined | null | UserGetDetailLanguage[]>(userProfile?.userLanguage);
    const [deleted, setDeleted] = useState<Boolean>(false);
    const [provider, setProvider] = useState<string>('');

    const dummy = [{id: 69, language: "English", proficiency: "Native"}];

    // Check provider
    async function checkProvider() {
        const provider = auth.currentUser?.providerData[0].providerId;
        // console.log(provider);
        if (provider) setProvider(provider);
    }
    useEffect(() => {
        checkProvider()
    }, []);

    //get user profile from server by uid
    const serverProfile = async () => {
        try {
            const fetchUserProfile = await axios.get(url + 'detail/' + userUid);
            setUserProfile(fetchUserProfile.data);
            setFirstNameUpdate(fetchUserProfile.data.firstName);
            setLastNameUpdate(fetchUserProfile.data.lastName);
            setAboutUpdate(fetchUserProfile.data.about);
            setLanguageUpdate(fetchUserProfile.data.userLanguage[0].language);
            
            console.log("user profile: ", fetchUserProfile.data)
        } catch(error) {
            console.log("error: ", error);
        }
    } 

    //calls serverProfile when userUid is retrieved
    useEffect(() => {
        if(userUid !== 'noUid') {
            serverProfile();
        } 
    }, [userUid]);

    //if profile is updated call for the profile from the backend
    //and setUpdated back to false
    useEffect(() => {
        if(updated) {
            serverProfile();
            setUpdated(false);
        }
    }, [updated]);

    //if language is deleted call for the profile from the backend
    //and setDeleted back to false
    useEffect(() => {
        if(deleted) {
            serverProfile();
            setDeleted(false);
        }
    }, [deleted]);

    // const handleDelete =async (e) => {
    //     const languageObjId = e.target.value;
    //     await axios.delete(url + languageObjId);
    //     setDeleted(true);
    // }

    // const handleUpdate = async () => {
    //     console.log("update First: ", firstNameUpdate)
    //     const updateProfileData = {
    //         userId: userProfile?.id, 
    //         firstName: firstNameUpdate, 
    //         lastName: lastNameUpdate,
    //         about: aboutUpdate,
    //         languages: [{
    //             id: null,
    //             language: languageUpdate,
    //             proficiency: ""
    //         }]
    //     };
    //     console.log(updateProfileData)
    //     const returnedData = await axios.put(url, updateProfileData).catch(error => {
    //         window.alert(error.response.data);
    //     });
    //     setUpdated(true);

    //     if(returnedData) {
    //         window.alert(returnedData.data);
    //     }
    // }

    return (
        
        <Paper elevation={3} className='profile-container'>
            <h1 className='profile-container__header'>{userProfile?.firstName} {userProfile?.lastName}</h1>
            {/* <div className='profile-container__pic-container'> */}
                <Image 
                    src={profilePic}
                    alt='Avatar'
                    className='profile-container__profile-pic'
                    width={200}
                    height={200}
                />
            {/* </div> */}

            {/* <p className='profile-p'>ID: {userProfile?.id}</p> */}

            

            {/* <p className='profile-p'>First Name: {userProfile?.firstName}</p>
            <p className='profile-p'>Last Name: {userProfile?.lastName}</p> */}

            {/* {userProfile?.userLanguage.map((language, index)=> {
                return (
                    <div className='profile-container__language'>
                        <div className='profile-container__language__id'>{language.id}</div>
                        <div className='profile-container__language__language'>{language.language}</div>
                        <div className='profile-container__language__proficiency'>{language.proficiency}</div>
                        <button 
                            className='profile-container__language_deletebtn'
                            value={language.id}
                            onClick={handleDelete}
                        >
                        Delete
                        </button>
                    </div>
                )
            })} */}
            {/* {userProfile?.userLanguage.map((val, i) => (
                <p className='profile-p'>Language: {userProfile?.userLanguage[userProfile?.userLanguage.length-1].language}</p>
            ))} */}

            <div className='profile-container__info-container'>
                <label className='profile-container__label'>First Name:</label>
                <p className='profile-container__profile-p'>{userProfile?.firstName}</p>
                <label className='profile-container__label'>Last Name:</label>
                <p className='profile-container__profile-p'>{userProfile?.lastName}</p>
                {/* <label className='profile-container__label'>Language:</label>
                <p className='profile-container__profile-p'>{userProfile?.userLanguage[userProfile?.userLanguage.length-1].language}</p>
                <label className='profile-container__label'>Proficiency:</label>
                <p className='profile-container__profile-p'>{userProfile?.userLanguage[userProfile?.userLanguage.length-1].proficiency}</p>
                <p className='profile-container__profile-p'>Certifications: {userProfile?.userLanguage[userProfile?.userLanguage.length-1].certifications}</p> */}

                <label className='profile-container__label'>Bio:</label>
                <p className='profile-container__profile-p'>{userProfile?.about}</p>
            </div>
        
            <div className='profile-container__button-container'>
                <Link className='profile-container__edit-link' href="/profile/edit-profile">
                    <Button variant='contained' className='profile-container__profile-button' id='profile-container__edit-button'>
                    Edit Profile
                    </Button>
                </Link>


                {/* <button className='profile-container__profile-button'>help/support</button>
                <button className='profile-container__profile-button'>Agreement</button> */}



                {provider === "password" && (
                    <Link className='profile-container__password-link' href="/profile/update-password">
                        <Button variant='contained' className='profile-container__password-button' id='profile-container__password-button'>
                        Update password
                        </Button>
                    </Link>
                )}    

                {/* <button onClick={checkProvider}>Check provider</button> */}

                <Link className='profile-container__delete-link' href="/profile/delete-account">
                    <Button variant='outlined' className='profile-container__delete-button' id='profile-container__delete-button'>
                        Delete Account
                    </Button>
                </Link>
            </div>
        </Paper>
    );
}