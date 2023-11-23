'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

//TYPESCRIPT THING
type Appointment = {
    id: number;
    appointmentDateTime: string;
    locationLatitude: number;
    locationLongitude: number;
    status: string;
    clientUserId: number;
    clientSpokenLanguage: string;
    clientDesiredLanguage: string;
    translatorUserId: number;
    translatorLanguage: string;
    appointmentNote: string;
    reviewRating: number;
    reviewNote: string;
    // +transletor-clientname : string;
};
type StatusFilter = 'Requesting' | 'Ongoing' | 'Cancelled' | 'Completed' | '';

export default function History() {
    const [history, setHistory] = useState<Appointment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedHistoryId, setSelectedHistoryId] =  useState<number | null>(null);

    //USEEFFECT TO GET HISTORY DATA FROM BACKEND
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('APIENDPOINT');
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching History:', error);
            }
        };  
        fetchHistory();
    }, []);

    //SEARCH BAR
    // const filteredHistory = history.filter(eachHistory => {
    //     const dateTimeLower = eachHistory.appointmentDateTime.toLowerCase();
    //     // const nameLower = eachHistory.translatorClientName.toLowerCase(); 
    //     const locationString = `${eachHistory.locationLatitude}, ${eachHistory.locationLongitude}`;
    
    //     return dateTimeLower.includes(searchTerm.toLowerCase()) ||
    //            nameLower.includes(searchTerm.toLowerCase()) ||
    //            locationString.includes(searchTerm);
    // });

    const handleStatusFilter = (status: StatusFilter) => {
        setSelectedStatus(status);
    };

    const filteredHistory = history.filter(eachHistory =>
        selectedStatus === '' || eachHistory.status === selectedStatus
    );

    const handleHistoryClick = (id: number) => {
        if (selectedHistoryId === id) {
            setSelectedHistoryId(null); 
        } else {
            setSelectedHistoryId(id); 
        }
    };



    return (
        <div>
            <h1>History</h1>
            <input 
                type="text" 
                placeholder="Search..." 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <div>
                <button className ='history__requesting__button' onClick={() => handleStatusFilter('Requesting')}>Requesting</button>
                <button className ='history__ongoing__button' onClick={() => handleStatusFilter('Ongoing')}>Ongoing</button>
                <button className = 'history__cancelled__button' onClick={() => handleStatusFilter('Cancelled')}>Cancelled</button>
                <button className = 'history__completed__button' onClick={() => handleStatusFilter('Completed')}>Completed</button>
                <button className = 'history__reset__button'onClick={() => handleStatusFilter('')}>Clear</button>
            </div>
            <div className='history__container'>           
                 {history.map((eachHistory) => (
                <div key={eachHistory.id} className='hisotry__list__block'>
                    <p className='history__when'>Date and Time: {eachHistory.appointmentDateTime}</p>
                    {/* <p className= 'history__who'>Associated : {eachHistory.translator-clientname}</p> */}
                    <p className='history__where'>Location: Lat {eachHistory.locationLatitude}, Long {eachHistory.locationLongitude}</p>
                    {/* google geocode or google map this lat&log in history in backend  */}
                    <p className= 'history__status'>Status: {eachHistory.status}</p>
                    {selectedHistoryId === eachHistory.id && (
                            <div className="history__details">
                                {/* more details here */}
                                {/* <p>Appointment Note: {eachHistory.appointmentNote}</p> */}
                                
                            </div>
                        )}                
                </div>
                ))}
            </div>
        </div>
    );
}