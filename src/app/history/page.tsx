import React from 'react';
import { Metadata } from 'next';
import HistoryCard from './history-card';
import CheckAuth from '../auth/check-auth';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Tsugo',
  }

export default function History() {
    return ( 
        <div className='history'>
            <CheckAuth />
            <HistoryCard />
        </div>
    );
}