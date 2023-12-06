//Modules Import
import { Metadata } from "next";
import CheckAuth from "@/app/auth/check-auth";
import UpdatePasswordCard from "./update-password-card";

//Page Name
export const metadata: Metadata = {
    title: 'Update Password',
}

//Page Component
export default async function UpdatePassword() {
    return (
        <div className='update-password'>
            <CheckAuth />
            <UpdatePasswordCard />
        </div>
    );
}