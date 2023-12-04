'use client';
import React, {useContext, useEffect, useState} from "react";
import { ContextVariables } from "@/context-variables";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import profilePic from '../../../../public/default.jpg'

export default function EditProfile() {

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
    const [lastNameUpdate, setLastNameUpdate] = useState<string | number | readonly string[] | undefined>(userProfile?.lastName);
    const [aboutUpdate, setAboutUpdate] = useState<string | number | readonly string[] | undefined>("");
    // const [languageUpdate, setLanguageUpdate] = useState<string | number | readonly string[] | undefined | null | UserGetDetailLanguage[]>();
    // const [proficiencyUpdate, setProficiencyUpdate] = useState<string | number | readonly string[] | undefined | null | UserGetDetailLanguage[]>(userProfile?.userLanguage);
    // const [certificationUpdate, setCertificationUpdate] = useState<string | number | readonly string[] | undefined | null | UserGetDetailLanguage[]>(userProfile?.userLanguage);

    const dummy = [{id: 69, language: "English", proficiency: "Native"}];

    //get user profile from server by uid
    const serverProfile = async () => {
        try {
            const fetchUserProfile = await axios.get(url + 'detail/' + userUid);
            setUserProfile(fetchUserProfile.data);
            setFirstNameUpdate(fetchUserProfile.data.firstName);
            setLastNameUpdate(fetchUserProfile.data.lastName);
            setAboutUpdate(fetchUserProfile.data.about);
            // setLanguageUpdate(fetchUserProfile.data.userLanguage[0].language);
            // setProficiencyUpdate(fetchUserProfile.data.userLanguage[0].proficiency);
            // setCertificationUpdate(fetchUserProfile.data.userLanguage[0].certifications);
            
            console.log("lu",fetchUserProfile.data.userLanguage[0])
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
            // languages: [{
            //     id: 3,
            //     language: languageUpdate,
            //     proficiency: proficiencyUpdate,
            //     certifications: certificationUpdate,
            // }]
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
        <div className='edit-profile__card'>
            <h1 className="edit-profile__header">Edit Profile</h1>
            <Image 
                src={profilePic}
                alt='Avatar'
                className='profile-pic'
                width={200}
                height={200}
            />
                <div className="updateform">
                <label>Update First Name:</label>
                {/* <p className='edit-profile-p'>First Name: {userProfile?.firstName}</p> */}
                <input 
                    type='text'
                    className="edit-profile__input"
                    id='edit-profile__input__firstName'
                    onChange={(e) => setFirstNameUpdate(e.target.value)}
                    value={firstNameUpdate}
                    defaultValue={userProfile?.firstName}
                />
                <br></br>

                <label>Update Last Name:</label>
                {/* <p className='edit-profile-p'>Last Name: {userProfile?.lastName}</p> */}
                <input 
                    type='text'
                    className="edit-profile__input"
                    id='edit-profile__input__lasttName'
                    onChange={(e) => setLastNameUpdate(e.target.value)}
                    value={lastNameUpdate}
                    defaultValue={userProfile?.lastName}
                />

                {/* <label>Update Language:</label>
                <select 
                    id='edit-profile__input__language'
                    className="edit-profile__input"
                    onChange={(e) => setLanguageUpdate(e.target.value)}
                    value={languageUpdate}
                    defaultValue={userProfile?.userLanguage[userProfile?.userLanguage.length-1].language}
                >
                    <option value="">Choose a Language</option>
                    <option value="English">English</option>
                    <option value="Japanese">Japanese</option>
                </select>

                <label>Update Proficiency:</label>
                <select
                    id='edit-profile__input__proficiency'
                    className="edit-profile__input"
                    onChange={(e) => setProficiencyUpdate(e.target.value)}
                    value={proficiencyUpdate}
                    defaultValue={userProfile?.userLanguage[userProfile?.userLanguage.length-1].proficiency}
                >
                    <option value="">Choose Proficiency Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                </select>

                <label>Update Certification:</label>
                <input 
                    type='text'
                    className="edit-profile__input"
                    id='edit-profile__input__certification'
                    onChange={(e) => setCertificationUpdate(e.target.value)}
                    value={certificationUpdate}
                    defaultValue={userProfile?.userLanguage[userProfile?.userLanguage.length-1].certifications}
                /> */}

                <label>Update Bio:</label>
                {/* <p className='edit-profile-p'>Language: {userProfile?.language}</p> */}
                <input 
                    type='text'
                    className="edit-profile__input"
                    id='edit-profile__input__about'
                    onChange={(e) => setAboutUpdate(e.target.value)}
                    value={aboutUpdate}
                />
                </div>   
                
                             
                <button className='edit-profile-button' id='edit-button' onClick={handleUpdate}>Save Changes</button>
        </div>
    );
}