'use client';
import React, { useContext, useEffect, useState } from 'react';
import { ContextVariables } from '../../context-variables';
import axios from "axios"
import Link from 'next/link';

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

    const dummy = [{id: 69, language: "English", proficiency: "Native"}];

    //get user profile from server by uid
    const serverProfile = async () => {
        try {
            const fetchUserProfile = await axios.get(url + 'detail/' + userUid);
            setUserProfile(fetchUserProfile.data);
            setFirstNameUpdate(fetchUserProfile.data.firstName);
            setLastNameUpdate(fetchUserProfile.data.lastName);
            setAboutUpdate(fetchUserProfile.data.about);
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

    const handleUpdate = async () => {
        console.log("update First: ", firstNameUpdate)
        const updateProfileData = {
            userId: userProfile?.id, 
            firstName: firstNameUpdate, 
            lastName: lastNameUpdate,
            about: aboutUpdate,
            languages: [{
                id: null,
                language: "",
                proficiency: ""
            }]
        };
        console.log(updateProfileData)
        const returnedData = await axios.put(url, updateProfileData).catch(error => {
            window.alert(error.response.data);
        });
        setUpdated(true);

        if(returnedData) {
            window.alert(returnedData.data);
        }
    }

    return (
        
        <div className='profile-container'>
            <h1 className='profile-header'>User Profile</h1>
            <p className='profile-p'>ID: {userProfile?.id}</p>
            <p className='profile-p'>First Name: {userProfile?.firstName}</p>
            <p className='profile-p'>Last Name: {userProfile?.lastName}</p>
            {/* {userProfile?.userLanguage.map((language, index)=> {
                return (
                    <div>
                    <div>{language.id}</div>
                    <div>{language.language}</div>
                    <div>{language.proficiency}</div>
                    </div>
                )
            })} */}
            <p className='profile-p'>Language: {}</p>
        
            
            <Link className='edit-link' href="/profile/edit-profile">
                <div className='profile-button' id='edit-button'>
                edit
                </div>
            </Link>
                
            
            <button className='profile-button'>delete</button>
            <button className='profile-button'>help/support</button>
            <button className='profile-button'>Agreement</button>
        </div>
    );
}