//Modules Import
import { Metadata } from "next";
import CheckAuth from "@/app/auth/check-auth";
import EditProfile from "./edit-profile-card";

//Page Name
export const metadata: Metadata = {
    title: 'EditProfile',
}

//Page Component
export default async function EditProfilePage() {
    return (
        <div className='edit-profile'>
            <CheckAuth />
            <EditProfile />
        </div>
    );
}