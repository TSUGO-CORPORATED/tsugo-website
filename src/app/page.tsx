// MODULES IMPORT
import { Metadata } from 'next';
import LandingPage from './landing-page';
import CheckAuth from './auth/check-auth';
//import ChatRoomSub from './chat-room/chat-room-component'; THIS IS HERE FOR IMPORTANT TESTING PURPOSES

// PAGE NAME
export const metadata: Metadata = {
    title: 'Home',
}

// PAGE COMPONENT
export default function Home(): JSX.Element {
    return (
        <div className="home">
            <CheckAuth />
            <LandingPage />
        </div>
    )
}