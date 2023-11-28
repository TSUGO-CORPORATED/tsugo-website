'use client';

// MODULES IMPORT
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChatRoomSub from "./appointment-detail/chat-room/chat-room-component"

// PAGE COMPONENT
export default function HomeRedirect(): JSX.Element {
    const router = useRouter();
    return (
        <>
            <Link href="/log-in" className='sign-up__card__log-in-link'><p>Go to Log In</p></Link>
            <ChatRoomSub/>
        </>
    )
}