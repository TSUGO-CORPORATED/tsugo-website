'use client';

import React, {useContext, useState} from "react";
import { ContextVariables } from "@/context-variables";
import Link from "next/link";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { auth } from "../../../firebase";
import { useRouter } from 'next/navigation';
import { TextField, Button } from '@mui/material';


export default function UpdatePasswordCard(): JSX.Element {
    // STATE VARIABLES
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    const { userEmail } = useContext(ContextVariables);

    const router = useRouter();

    // HELPER FUNCTION
    async function updatePasswordFunction(event: React.FormEvent) {
        event.preventDefault();
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
                });
            }).catch((error) => {
                // An error ocurred
                console.log(error);
            });
        }
    }

    return (
        <div className="update-password__container">
            <h1 className="update-password__header">Change Password</h1>
            
            <form onSubmit={updatePasswordFunction}>
                <div className='update-password__form'>
                    <label className='update-password__label'>Old password:</label>
                    <TextField 
                        variant="outlined"
                        type="text" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                        required 
                        className='update-password__input' 
                    />
                </div>
                <div className='update-password__form'>
                    <label className='update-password__label'>New password:</label>
                    <TextField 
                        variant="outlined"
                        type="text" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        className='update-password__input' 
                    />
                </div>
                <div className="update-password__button_box">
                    <Button variant="contained" type="submit" className='update-password__submit_button'>Confirm</Button>
                </div>
            </form>

            <Link href='/profile'>
                <Button variant="contained" className='update-password__profile-button'>Cancel</Button>
            </Link>
        </div>
    );
}