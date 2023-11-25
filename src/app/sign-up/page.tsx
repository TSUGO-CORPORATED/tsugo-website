// MODULES IMPORT
import { Metadata } from 'next';
import SignUpCard from './sign-up-card';
import SkipLogIn from '../auth/skip-log-in';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Sign Up',
}

// PAGE COMPONENT
export default async function SignUp() {
    return (
        <div className="sign-up">
            <SignUpCard />
        </div>
    )
}