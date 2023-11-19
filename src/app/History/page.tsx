import React from 'react';
import Link from 'next/link';

export default function History() {
    return (
        <div>
            <h1>This is History Page</h1>
            <Link href="/dashboard">
                <button>Go Home</button>
            </Link>
        </div>
    );
}