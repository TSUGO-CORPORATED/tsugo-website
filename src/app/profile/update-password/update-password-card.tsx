'use client';
import React, {useContext, useEffect, useState} from "react";
import { ContextVariables } from "@/context-variables";
import Link from "next/link";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { auth } from "../../../firebase";
import { useRouter } from 'next/navigation';

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

            // updatePassword(user, newPassword).then(() => {})
            
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
        <div>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <Link href='/profile'>
                <button className='aadsf'>Cancel change password</button>
            </Link>
            <form onSubmit={updatePasswordFunction}>
                <div className='add_request_box'>
                    <label className='add_request_label'>Old password:</label>
                    <input 
                        type="text" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                        required 
                        className='add_request_input' 
                    />
                </div>
                <div className='add_request_box'>
                    <label className='add_request_label'>New password:</label>
                    <input 
                        type="text" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        className='add_request_input' 
                    />
                </div>
                <div className="button_box">
                    <button type="submit" className='add_request_submit_button'>Confirm</button>
                </div>
            </form>
        </div>
    );
}