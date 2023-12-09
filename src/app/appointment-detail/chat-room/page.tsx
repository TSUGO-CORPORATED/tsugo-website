// MODULES IMPORT
import CheckAuth from '@/app/auth/check-auth';
import { Metadata } from 'next';
//import ChatRoomSub from './chat-room-component';
import dynamic from 'next/dynamic';

// PAGE NAME
export const metadata: Metadata = {
  title: 'Chat Room',
}

const ChatRoomSub = dynamic(() => {
  return import('./chat-room-component');
}, {ssr: false}
);

// PAGE COMPONENT
export default function ChatRoom(): JSX.Element {
  return (
      <div className="chat-room">
        <CheckAuth />
        <ChatRoomSub />
      </div>
  )
}
