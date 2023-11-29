import React from 'react';
import Link from 'next/link';
import History from './history-components'

export default function HistoryPage() {
    return ( 
        <div>
            <Link href="/dashboard">
                <button>Go Home</button>
            </Link>
            < History />
            
        </div>
    );
}