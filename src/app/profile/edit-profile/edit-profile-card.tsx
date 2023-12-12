'use client';

// IMPORT MODULE
import React, {useContext, useEffect, useState} from "react";
import { ContextVariables } from "@/context-variables";
import axios from "axios";
import Link from "next/link";


// IMPORT FROM MUI
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { TextField, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { buttonOffDark, buttonWhite } from "@/muistyle";
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';

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

    const url: string = `${process.env.NEXT_PUBLIC_DATABASE_SERVER_URL}/user/`;
    const { userId, userFirstName, userLastName, userUid, userPhotoUrl } = useContext(ContextVariables);
    const [userProfile, setUserProfile] = useState<UserDetails | null>();
    // const [updated, setUpdated] = useState<Boolean>(false);
    const [firstNameUpdate, setFirstNameUpdate] = useState<string | number | readonly string[] | undefined>("");
    const [lastNameUpdate, setLastNameUpdate] = useState<string | number | readonly string[] | undefined>("");
    const [aboutUpdate, setAboutUpdate] = useState<string | number | readonly string[] | undefined>("");
    // const [languageUpdate, setLanguageUpdate] = useState<string | number | readonly string[] | undefined | null | UserGetDetailLanguage[]>();
    // const [proficiencyUpdate, setProficiencyUpdate] = useState<string | number | readonly string[] | undefined | null | UserGetDetailLanguage[]>(userProfile?.userLanguage);
    // const [certificationUpdate, setCertificationUpdate] = useState<string | number | readonly string[] | undefined | null | UserGetDetailLanguage[]>(userProfile?.userLanguage);
    const [confirmWindowOpen, setConfirmWindowOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const dummy = [{id: 69, language: "English", proficiency: "Native"}];
    const router = useRouter();

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
        } setLoading(false);
    }, [userUid]);

    //if profile is updated call for the profile from the backend
    //and setUpdated back to false
    // useEffect(() => {
    //     if(updated) {
    //         serverProfile();
    //         setUpdated(false);
    //     }
    // }, [updated]);

    // Handle update data
    const confirmWindowStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        // border: '2px solid #000',
        boxShadow: 2,
        // p: 4,
    };

    function confirmWindowHandleOpen(e: any): void {
        e.preventDefault();
        setConfirmWindowOpen(true);
    };
    function confirmWindowHandleClose(): void {
        setConfirmWindowOpen(false);
    } 

    async function handleUpdate() {
        // console.log("update First: ", firstNameUpdate)
        const updateProfileData = {
            userId: userProfile?.id, 
            firstName: firstNameUpdate, 
            lastName: lastNameUpdate,
            about: aboutUpdate,
            languages: [{
                id: 3,
                language: "",//languageUpdate,
                proficiency: "",//proficiencyUpdate,
                certifications: "",//certificationUpdate,
            }]
        };
        // console.log(updateProfileData)
        const returnedData = await axios.put(url, updateProfileData).catch(error => {
            window.alert(error.response.data);
        });
        // setUpdated(true);

        if(returnedData) {
        //     window.alert(returnedData.data);
            router.push("/profile");
        }
    }

    if (loading) {
        return <CircularProgress />; 
      }
    //JSX ELEMENTS
    return (
        <Paper elevation={3} className='edit-profile-container'>
            <Link href="/profile" className='profile-container__back-button'>
                <ArrowBackIcon sx={{fontSize: "32px"}}/>
            </Link>
            <Modal
                open={confirmWindowOpen}
                onClose={confirmWindowHandleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableEnforceFocus
            >
                <Box sx={confirmWindowStyle} className='edit-profile-container__confirm-window'>
                    <div className='edit-profile-container__confirm-window__title'>Confirm Update Profile</div>
                    <div className='edit-profile-container__confirm-window__description'>Are you sure you want to update?</div>
                    <div className='edit-profile-container__confirm-window__button'>
                        <Button variant='outlined' onClick={confirmWindowHandleClose} sx={buttonWhite}>Cancel</Button>
                        <Button variant='contained' onClick={handleUpdate} sx={buttonOffDark}>Confirm</Button>
                    </div>
                </Box>
            </Modal>
            <div className='edit-profile-container__info'>
                <h1 className="edit-profile-container__header">Edit Profile</h1>
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
                {/* <Image 
                    src={profilePic}
                    alt='Avatar'
                    className='edit-profile-container__profile-pic'
                    width={200}
                    height={200}
                /> */}
                <form onSubmit={confirmWindowHandleOpen} className="edit-profile-container__info-update">
                    {/* <label className="edit-profile-container__label">Update First Name:</label> */}
                    {/* <p className='edit-profile-p'>First Name: {userProfile?.firstName}</p> */}
                    <TextField 
                        label='Update First Name'
                        type='text'
                        className="edit-profile-container__input"
                        id='outlined-basic'
                        variant="outlined"
                        onChange={(e) => setFirstNameUpdate(e.target.value)}
                        value={firstNameUpdate}
                        inputProps={{
                            style: {
                              padding: '14px 14px',
                            },
                        }}
                        required
                    />

                    {/* <label className="edit-profile-container__label">Update Last Name:</label> */}
                    {/* <p className='edit-profile-p'>Last Name: {userProfile?.lastName}</p> */}
                    <TextField
                        label='Update Last Name'
                        id='outlined-basic'
                        variant="outlined"
                        type='text'
                        className="edit-profile-container__input"
                        onChange={(e) => setLastNameUpdate(e.target.value)}
                        value={lastNameUpdate}
                        inputProps={{
                            style: {
                              padding: '14px 14px',
                            },
                        }}
                        required
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
                    
                    {/* <label className="edit-profile-container__label">Update Bio:</label> */}
                    {/* <p className='edit-profile-p'>Language: {userProfile?.language}</p> */}
                    <TextField
                        label='Update Bio'
                        id='outlined-basic'
                        variant="outlined"
                        type='text'
                        className="edit-profile-container__input"
                        onChange={(e) => setAboutUpdate(e.target.value)}
                        value={aboutUpdate}
                        inputProps={{
                            style: {
                              padding: '10px 14px',
                            },
                        }}
                    />
                    <div className="edit-profile-container__button-container">
                        <Button type='submit' variant="contained" sx={buttonOffDark}>
                            <div className='edit-profile-container__button-container__button'>Save Changes</div>
                        </Button>
                        <Link className='edit-profile-container__button-container__link' href="/profile">
                            <Button variant='contained' sx={buttonWhite}>
                                <div className='edit-profile-container__button-container__button'>Cancel</div>
                            </Button>
                        </Link>
                    </div >
                </form>       
            </div>
        </Paper>
    );
}