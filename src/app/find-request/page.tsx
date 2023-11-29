// MODULES IMPORT
import { Metadata } from 'next';
import FindRequestCard from './find-request-card';


// PAGE NAME
export const metadata: Metadata = {
    title: 'Find Request',
}

// PAGE COMPONENT
export default async function FindRequest() {
    return (
        <div className='find-request'>
            <FindRequestCard />
        </div>
    )
}