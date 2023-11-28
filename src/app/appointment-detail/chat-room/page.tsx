// MODULES IMPORT
import { Metadata } from 'next';
import ChatRoomSub from './chat-room-component';

// PAGE NAME
export const metadata: Metadata = {
  title: 'Chat Room',
}

// PAGE COMPONENT
export default function ChatRoom(): JSX.Element {
  return (
      <div className="message-box">
        <ChatRoomSub />
      </div>
  )
}
