'use client';

import React, {useContext, useState} from "react";
import { ContextVariables } from "@/context-variables";
import Link from "next/link";
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from "../../../firebase";
import { useRouter } from 'next/navigation';
import axios from "axios";

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
        <div>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <Link href='/profile'>
                <button className='aadsf'>Go back to profile</button>
            </Link>
            <form onSubmit={deleteAccountFunction}>
                <div className='add_request_box'>
                    <label className='add_request_label'>Confirm password:</label>
                    <input 
                        type="text" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        className='add_request_input' 
                    />
                </div>
                <p>Warning blah... blah... blah...</p>
                <div className="button_box">
                    <button type="submit" className='add_request_submit_button'>Confirm delete account</button>
                </div>
            </form>
        </div>
    )
}