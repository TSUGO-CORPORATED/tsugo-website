// MODULES IMPORT
import { Metadata } from 'next';
import DeleteAccountCard from './delete-account-card';
import CheckAuth from "@/app/auth/check-auth";

// PAGE NAME
export const metadata: Metadata = {
    title: 'Delete Account',
}

// PAGE COMPONENT
export default async function DeleteAccount() {
    return (
        <div className='delete-account'>
            <CheckAuth />
            <DeleteAccountCard />
        </div>
    )
}