// MODULES IMPORT
import { Metadata } from 'next';
import Profile from './profile-components'
import CheckAuth from '../auth/check-auth';


// PAGE NAME
export const metadata: Metadata = {
    title: 'Tsugo',
}

// PAGE COMPONENT
export default async function ProfilePage() {
    return (
        <div className='profile'>
            <CheckAuth />
            <Profile />
        </div>
    )
}