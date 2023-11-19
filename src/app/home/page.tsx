// MODULES IMPORT
import { Metadata } from 'next';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Home',
}

// PAGE COMPONENT
export default async function Home() {
    return (
        <div>Home</div>
    )
}