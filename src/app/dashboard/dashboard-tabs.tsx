'use client';
import React, { useState } from 'react';
import Link from 'next/link';
// import styles from '../../../css/dashboardtabs.module.scss';


export default function DashboardTabs() {
    //useState
    //switching  Tabs Request Translator&Find request
    const [currentTab, setCurrentTab] = useState('Request');

    return (
        <div className="dashboard-tabs">
            <button onClick={() => setCurrentTab('Request')}>Request</button>
            <button onClick={() => setCurrentTab('Find')}>Find</button>
            <div className="dashboard-tab-content">
                {currentTab === 'Request' && (
                <div>
                    <p>render accepted appointment in here?</p>
                    <Link href="/user-translator-appointment/page">
                            <a><button>Go to Request Translator</button></a>
                    </Link>
                    </div>)}
                {currentTab === 'Find' && (
                    <div>
                        <p>render accepted req in here?</p>
                        <Link href="/user-client-appointment">
                            <a><button>Go to Search Requests</button></a>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}