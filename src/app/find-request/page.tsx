// MODULES IMPORT
import { Metadata } from 'next';
import FindRequestCard from './find-request-card';
import CheckAuth from '../auth/check-auth';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Tsugo',
}

// PAGE COMPONENT
export default async function FindRequest() {
    return (
        <div className='find-request'>
            <CheckAuth />
            <FindRequestCard />
        </div>
    )
}