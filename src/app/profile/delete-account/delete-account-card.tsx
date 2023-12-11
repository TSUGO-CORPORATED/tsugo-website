'use client';

// IMPORT MODULES
import React, {useContext, useState} from "react";
import { ContextVariables } from "@/context-variables";
import Link from "next/link";
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from "../../../firebase";
import { useRouter } from 'next/navigation';
import axios from "axios";

// IMPORT FROM MUI
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { buttonOffDark, buttonRed, buttonWhite } from "@/muistyle";
import { TextField, Button, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function DeleteAccountCard(): JSX.Element {
    // STATE VARIABLES
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [confirmWindowOpen, setConfirmWindowOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const { userEmail, userUid } = useContext(ContextVariables);

    const router = useRouter();

    // HELPER FUNCTION
    // Handle delete account
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

    async function deleteAccountFunction(event: React.FormEvent) {
        event.preventDefault();
        if (auth.currentUser) {
            const user = auth.currentUser;

            // Verify old password
            const credential = EmailAuthProvider.credential(
                userEmail,
                confirmPassword
             );
            // console.log(userEmail);
            // console.log(oldPassword);
            // console.log(credential);
            reauthenticateWithCredential(user, credential).then(() => {
                console.log('verified');
                // If user re-authenticated, change password
                deleteUser(user).then(async () => {
                    // Delete in the back end database         
                    const url: string = `${process.env.NEXT_PUBLIC_DATABASE_SERVER_URL}/user/${userUid}`;           
                    await axios.delete(url);

                    // Delete successful.
                    alert("Account has been successfully deleted");
                    
                    // Sent to home page
                    router.push('/log-in');

                }).catch((error) => {
                    // An error ocurred
                    console.log(error);
                    alert('Failed to delete account');
                });
            }).catch((error) => {
                // An error ocurred
                console.log(error);
                alert('Failed to delete account');
            });
        }
    }

    return (
        <Paper elevation={3} className="delete-account__container">
            <Link href="/profile" className='delete-account__container__back-button'>
                <ArrowBackIcon className='delete-account__container__back-button__icon'/>
            </Link>
            <Modal
                open={confirmWindowOpen}
                onClose={confirmWindowHandleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableEnforceFocus
            >
                <Box sx={confirmWindowStyle} className='delete-account__confirm-window'>
                    <div className='delete-account__confirm-window__title'>Confirm Delete Account</div>
                    <div className='delete-account__confirm-window__description'>Are you sure you want to delete account?</div>
                    <div className='delete-account__confirm-window__button'>
                        <Button variant='contained' onClick={confirmWindowHandleClose} sx={buttonOffDark}>Cancel</Button>
                        <Button variant='outlined' onClick={deleteAccountFunction} sx={{...buttonWhite, color: 'red', borderColor: 'red'}}>Confirm</Button>
                    </div>
                </Box>
            </Modal>
            <div className="delete-account__container__info">
                <h1 className="delete-account__header">Delete Account</h1>
                <form onSubmit={confirmWindowHandleOpen} className='delete-account__form'>
                    {/* <label className='delete-account__label'>Confirm password:</label> */}
                    <p className="delete-account__message">Confirm your password to delete your account.</p>
                    <TextField
                        label='Confirm password'
                        variant="outlined" 
                        type="text" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        sx={{width: '70%'}}
                        className='delete-account__input' 
                    />
                    <div className="delete-account__button-box">
                        <Button variant="outlined" type="submit" className='delete-account__button' sx={{...buttonWhite, color: 'red', borderColor: 'red'}}>Confirm delete account</Button>
                        <Link href='/profile'>
                            <Button variant="contained" sx={buttonOffDark} className='delete-account__button'>Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </Paper>
    )
}