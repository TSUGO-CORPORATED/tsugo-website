'use client';

import React, {useContext, useState} from "react";
import { ContextVariables } from "@/context-variables";
import Link from "next/link";
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from "../../../firebase";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { TextField, Button, Paper } from '@mui/material';

export default function DeleteAccountCard(): JSX.Element {
    // STATE VARIABLES
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const { userEmail, userUid } = useContext(ContextVariables);

    const router = useRouter();

    // HELPER FUNCTION
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
                    const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/user/${userUid}`;           
                    await axios.delete(url);

                    // Delete successful.
                    alert("Account has been successfully deleted");
                    
                    // Sent to home page
                    router.push('/log-in');

                }).catch((error) => {
                    // An error ocurred
                    console.log(error);
                });
            }).catch((error) => {
                // An error ocurred
                console.log(error);
            });
        }
    }

    return (
        <Paper elevation={3} className="delete-account__container">
            <h1 className="delete-account__header">Delete Account</h1>
           
            <form onSubmit={deleteAccountFunction}>
                <div className='delete-account__form'>
                    <label className='delete-account__label'>Confirm password:</label>
                    <TextField
                        variant="outlined" 
                        type="text" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        className='delete-account__input' 
                    />
                </div>
                <p className="delete-account__message">Confirm your password to delete your account.</p>
                <div className="delete-account__button_box">
                    <Button variant="contained" type="submit" className='delete-account__submit_button'>Confirm delete account</Button>
                </div>
            </form>

            <Link href='/profile'>
                <Button variant="contained" className='delete-account__profile-button'>Cancel</Button>
            </Link>
        </Paper>
    )
}