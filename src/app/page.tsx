// MODULES IMPORT
import { Metadata } from 'next';
import HomeRedirect from './home-redirect';
//import ChatRoomSub from './chat-room/chat-room-component'; THIS IS HERE FOR IMPORTANT TESTING PURPOSES

// PAGE NAME
export const metadata: Metadata = {
    title: 'Home',
}

// PAGE COMPONENT
export default function Home(): JSX.Element {
    return (
        <div className="home">
        </div>
    )
}