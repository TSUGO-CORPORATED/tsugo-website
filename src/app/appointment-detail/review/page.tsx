// MODULES IMPORT
import { Metadata } from 'next';
import ReviewCard from './review-card';
import CheckAuth from '@/app/auth/check-auth';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Review',
}

// PAGE COMPONENT
export default function Review(): JSX.Element {
    return (
        <div className="review">
            <CheckAuth />  
            <ReviewCard />
        </div>
    )
}