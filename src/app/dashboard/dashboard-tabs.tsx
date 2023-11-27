'use client';
import React, { useState } from 'react';
import Link from 'next/link';


export default function DashboardTabs() {
    const [currentTab, setCurrentTab] = useState<string>('Request');

    return (
        <div className="dashboard-tabs">
            <div className="dashboard-tabs__buttons-row">
                <button onClick={() => setCurrentTab('Request')} className="dashboard-tabs__tab__button">Request</button>
                <button onClick={() => setCurrentTab('Find')} className="dashboard-tabs__tab__button">Find</button>
            </div>
            <div className="dashboard-tabs__content">
                {currentTab === 'Request' && (
                    <div className="dashboard-tabs__request__section">
                        <Link href="/add-request">
                            <button className="dashboard-tabs__request__button">Add Requests</button>
                        </Link>

                        <Link href="/history">
                            <button className="dashboard-tabs__request__historybutton">History</button>
                        </Link>
                        <p className="dashboard-tabs__client__status">status for client</p>
                    </div>
                )}
                {currentTab === 'Find' && (
                    <div className="dashboard-tabs__find__section">
                        <Link href="/find-request">
                            <button className="dashboard-tabs__find__button">Find Request</button>
                        </Link>
                        <Link href="/history">
                            <button className="dashboard-tabs__find__historybutton">History</button>
                        </Link>
                        <p className="dashboard-tabs__translator__status">status for translator</p>
                    </div>
                )}
            </div>
        </div>
    );
}