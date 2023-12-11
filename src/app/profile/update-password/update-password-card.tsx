'use client';

// IMPORT MODULES
import React, {useContext, useState} from "react";
import { ContextVariables } from "@/context-variables";
import Link from "next/link";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { auth } from "../../../firebase";
import { useRouter } from 'next/navigation';

// IMPORT MUI
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { buttonOffDark, buttonWhite } from "@/muistyle";
import { TextField, Button, Paper } from '@mui/material';


export default function UpdatePasswordCard(): JSX.Element {
    // STATE VARIABLES
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmWindowOpen, setConfirmWindowOpen] = useState<boolean>(false);

    const { userEmail } = useContext(ContextVariables);

    const router = useRouter();

    // HELPER FUNCTION
    // Handle update password
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
        e.preventDefault()
        setConfirmWindowOpen(true);
    };
    function confirmWindowHandleClose(): void {
        setConfirmWindowOpen(false);
    } 

    async function updatePasswordFunction(e: any) {
        e.preventDefault();
        if (auth.currentUser) {
            const user = auth.currentUser;

            // Verify old password
            const credential = EmailAuthProvider.credential(
                userEmail,
                oldPassword
             );
            // console.log(userEmail);
            // console.log(oldPassword);
            // console.log(credential);
            reauthenticateWithCredential(user, credential).then(() => {
                console.log('verified');
                // If user re-authenticated, change password
                updatePassword(user, newPassword).then(() => {
                    // Update successful.
                    alert("Update password successful, please log in again");
                    
                    // Logging out and sent to sign in page
                    signOut(auth)
                        .then(() => {
                            router.push('/log-in');
                        })
                        .catch((err) => {
                            console.log(err);
                    });
                }).catch((error) => {
                    // An error ocurred
                    console.log(error);
                    alert("Sorry, fail to change password")
                });
            }).catch((error) => {
                // An error ocurred
                console.log(error);
                alert("Sorry, fail to change password")
            });
        }
    }

    return (
        <Paper elevation={3} className="update-password__container">
            <Link href="/profile" className='update-password__container__back-button'>
                <ArrowBackIcon className='update-password__container__back-button__icon'/>
            </Link>
            <Modal
                open={confirmWindowOpen}
                onClose={confirmWindowHandleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableEnforceFocus
            >
                <Box sx={confirmWindowStyle} className='update-password__container__confirm-window'>
                    <div className='update-password__container__confirm-window__title'>Confirm Update Profile</div>
                    <div className='update-password__container__confirm-window__description'>Are you sure you want to update?</div>
                    <div className='update-password__container__confirm-window__button'>
                        <Button variant='outlined' onClick={confirmWindowHandleClose} sx={buttonWhite}>Cancel</Button>
                        <Button variant='contained' onClick={updatePasswordFunction} sx={buttonOffDark}>Confirm</Button>
                    </div>
                </Box>
            </Modal>
            <div className="update-password__container__info">
                <h1 className="update-password__container__info__header">Change Password</h1>
                <p>Please input your old password and new password</p>
                <Box className='update-password__container__info__form' onSubmit={confirmWindowHandleOpen}>
                    <TextField 
                        label='Old password'
                        variant="outlined"
                        type="password" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                        required 
                        className='update-password__container__info__form__input' 
                    />
                    <TextField 
                        label='New password'
                        variant="outlined"
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        className='update-password__container__info__form__input' 
                    />
                    <div className="update-password__container__info__form__button-box">
                        <Button type='submit' variant="contained" sx={buttonOffDark} className="update-password__container__info__form__button-box__button">Confirm</Button>
                        <Link href='/profile'>
                            <Button variant="contained" sx={buttonWhite} className="update-password__container__info__form__button-box__button">Cancel</Button>
                        </Link>
                    </div>
                </Box>
            </div>
        </Paper>
    );
}