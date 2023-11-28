'use client';
import React, {useContext, useEffect, useState} from "react";
import { ContextVariables } from "@/context-variables";
import axios from "axios";
import Link from "next/link";

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
        <div className='edit-profile__card'>
            <h1 className="edit-profile__header">EditProfile</h1>
                <div className="updateform">
                <label>Update First Name</label>
                <p className='edit-profile-p'>First Name: {userProfile?.firstName}</p>
                <input 
                    type='text'
                    id='firstName'
                    onChange={(e) => setFirstNameUpdate(e.target.value)}
                    value={firstNameUpdate}
                    defaultValue={userProfile?.firstName}
                />
                <br></br>

                <label>Update Last Name</label>
                <p className='edit-profile-p'>Last Name: {userProfile?.lastName}</p>
                <input 
                    type='text'
                    id='lasttName'
                    onChange={(e) => setLastNameUpdate(e.target.value)}
                    value={lastNameUpdate}
                    defaultValue={userProfile?.lastName}
                />
                </div>
                <br></br>
               
                

                
                <button className='edit-profile-button' id='edit-button' onClick={handleUpdate}>Save Changes</button>
        </div>
    );
}