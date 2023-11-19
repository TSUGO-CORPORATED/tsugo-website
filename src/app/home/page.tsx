// MODULES IMPORT
import { Metadata } from 'next';
import SignOut from '../auth/sign-out';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Home',
}

// PAGE COMPONENT
export default async function Home() {
    return (
        <div className='home'>
            <div>Home</div>
            <SignOut />
        </div>
    )
}