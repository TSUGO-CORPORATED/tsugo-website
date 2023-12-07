// MODULES IMPORT
import { Metadata } from 'next';
import LogInCard from './log-in-card';
import SkipLogIn from '../auth/skip-log-in';

// PAGE NAME
export const metadata: Metadata = {
  title: 'Tsugo',
}

// PAGE COMPONENT
export default function LogIn(): JSX.Element {
  return (
      <div className="log-in">
        <SkipLogIn />
        <LogInCard />
      </div>
  )
}
