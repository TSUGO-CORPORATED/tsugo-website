// MODULES IMPORT
import { Metadata } from 'next';
import LandingPage from './landing-page';
import CheckAuth from './auth/check-auth';
//import ChatRoomSub from './chat-room/chat-room-component'; THIS IS HERE FOR IMPORTANT TESTING PURPOSES
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'



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


export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}