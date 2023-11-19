// MODULES IMPORT
import { Metadata } from 'next';
import LogInCard from './log-in-card';

// PAGE NAME
export const metadata: Metadata = {
  title: 'Log In',
}

// PAGE COMPONENT
export default function LogIn(): JSX.Element {
  return (
      <div className="log-in">
        <LogInCard />
        {/* <SkipLogIn /> */}

      </div>
  )
}
