import React from 'react';
import Link from 'next/link';

export default function History() {
    return (
        <div>
            <h1>History</h1>
            <input type="text" placeholder="Search..." />
            <p>TemporaryList</p>
            <Link href="/rating">
                <button>Rating</button>
            </Link>
        </div>
    );
}