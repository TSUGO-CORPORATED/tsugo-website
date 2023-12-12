'use client';

// IMPORT MODULES
import React, { useContext, useEffect, useState } from 'react';
import { ContextVariables } from '../../context-variables';
import axios from "axios"
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import { TextField, Button, Paper } from '@mui/material';
import { auth } from "../../firebase";
import { buttonOffDark, buttonOffMid, buttonRed, buttonWhite } from '@/muistyle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';

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

    const url: string = `${process.env.NEXT_PUBLIC_DATABASE_SERVER_URL}/user/`;
    const { userId, userFirstName, userLastName, userUid, userPhotoUrl } = useContext(ContextVariables);
    const [userProfile, setUserProfile] = useState<UserDetails | null>();
    const [updated, setUpdated] = useState<Boolean>(false);
    const [firstNameUpdate, setFirstNameUpdate] = useState<string | number | readonly string[] | undefined>("");
    const [lastNameUpdate, setLastNameUpdate] = useState<String|undefined|null>(userProfile?.lastName);
    const [aboutUpdate, setAboutUpdate] = useState<String|undefined|null>(userProfile?.about);
    const [loading, setLoading] = useState(true);
    const [languageUpdate, setLanguageUpdate] = useState<string | number | readonly string[] | undefined | null | UserGetDetailLanguage[]>(userProfile?.userLanguage);
    const [deleted, setDeleted] = useState<Boolean>(false);
    const [provider, setProvider] = useState<string>('');

    // const dummy = [{id: 69, language: "English", proficiency: "Native"}];
    // console.log(userPhotoUrl)

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
            // setLanguageUpdate(fetchUserProfile.data.userLanguage[0].language);
            
            // console.log("user profile: ", fetchUserProfile.data)
        } catch(error) {
            console.log("error: ", error);
        }
    } 

    //calls serverProfile when userUid is retrieved
    useEffect(() => {
        if(userUid !== 'noUid') {
            serverProfile();
        } setLoading(false);
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
    if (loading) {
        return <CircularProgress />; 
      }
      
    return (
        <Paper elevation={3} className='profile-container'>
            <Link href="/dashboard" className='profile-container__back-button'>
                <ArrowBackIcon sx={{fontSize: "32px"}}/>
            </Link>
            <div className='profile-container__info'>
                <h1 className='profile-container__header'>{userProfile?.firstName} {userProfile?.lastName}</h1>
                {userPhotoUrl !== 'noPhotoUrl' ? (
                    <Avatar 
                        src={userPhotoUrl} 
                        sx={{ 
                            width: {
                                xs: '200px',
                                md: '225px'
                            }, 
                            height: {
                                xs: '200px',
                                md: '225px'
                            }, 
                        }}
                    />  
                    ) : (
                        <Avatar 
                        sx={{ 
                            width: {
                                xs: '200px',
                                md: '225px'
                            }, 
                            height: {
                                xs: '200px',
                                md: '225px'
                            }, 
                        }}
                    />  
                )}

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
                        <Button variant='contained' sx={buttonOffDark}>
                            <div className='profile-container__profile-button'>Edit Profile</div>
                        </Button>
                    </Link>
                    {provider === "password" && (
                        <Link className='profile-container__password-link' href="/profile/update-password">
                            <Button variant='contained' sx={buttonOffMid} >
                                <div className='profile-container__password-button'>Update password</div>
                            </Button>
                        </Link>
                    )}    
                    <Link className='profile-container__delete-link' href="/profile/delete-account">
                        <Button variant='outlined' sx={{...buttonWhite, color: 'red', borderColor: 'red'}}>
                            <div className='profile-container__delete-button'>Delete Account</div>
                        </Button>
                    </Link>
                    {/* <button onClick={checkProvider}>Check provider</button>
                    <button className='profile-container__profile-button'>help/support</button>
                    <button className='profile-container__profile-button'>Agreement</button>  */}
                </div>
            </div>
        </Paper>
    );
}