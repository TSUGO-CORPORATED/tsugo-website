'use client';

// MODULES IMPORT
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// TYPESCRIPT DATA TYPES
interface AppointmentDetail {
    id: number;
    appointmentTitle: string,
    appointmentType: string,
    clientSpokenLanguage: string;
    interpreterSpokenLanguage: string;
    locationName: string | number | readonly string[] | undefined;
    locationAddress: string | null;
    locationLatitude: string | number | null,
    locationLongitude: string | number | null,
    appointmentDateTime: string | number | readonly string[] | undefined;
    appointmentNote: string | number | readonly string[] | undefined;
    status: string;
    clientUserId: number;
    clientUser: {
        firstName: string;
        lastName: string;
        profilePicture?: any;
    };
    interpreterUserId: number | null;
    interpreterUser: {
        firstName: string;
        lastName: string;
        profilePicture?: any;
    } | null;
    reviewClientThumb: boolean | null,
    reviewClientNote: string | null,
    reviewInterpreterThumb: boolean | null,
    reviewInterpreterNote: string | null,
} 

type Coordinates = { lat: number; lng: number; } | null;

const languages = [
    "Japanese",
    "English",
    "Mandarin Chinese",
    "Hindi",
    "Spanish",
    "French",
    "Arabic",
    "Russian",
    "Portuguese",
    "Indonesian",
    "Korean",
    "Italian",
    "German",
    "Telugu",
    "Vietnamese",
    "Turkish",
];

// COMPONENT FUNCTION
export default function UpdateAppointmentCard() {
    // STATE VARIABLES
    const [appointmentTitle, setAppointmentTitle] = useState<string>("");
    const [appointmentDateTime, setAppointmentDateTime] = useState<string>('');
    const [clientSpokenLanguage, setClientSpokenLanguage] = useState<string>("");
    const [interpreterSpokenLanguage, setInterpreterSpokenLanguage] = useState<string>("");
    const [appointmentType, setAppointmentType] = useState<string>("");
    const [appointmentNote, setAppointmentNote] = useState<string | number | readonly string[] | undefined>("");
    const [locationName, setLocationName] = useState<string | number | readonly string[] | undefined>("");
    const [locationAddress, setLocationAddress] = useState<string | null>("");
    const [locationCoordinates, setLocationCoordinates] = useState<Coordinates | null>();
    const [locationLatitude, setLocationLatitude] = useState<string | number | null>();
    const [locationLongitude, setLocationLongitude] = useState<string | number | null>();

    const router = useRouter();

    // SEARCH PARAMS
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');

    // HELPER FUNCTION
    // Get appointment detail information
    async function getAppointmentDetail(): Promise<void> {
        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/detail/${appointmentId}`;
        const retrievedData = await axios.get(url);
        const data = retrievedData.data

        const processedDateTime = data.appointmentDateTime.substring(0, 16);

        setAppointmentTitle(data.appointmentTitle);
        setAppointmentType(data.appointmentType);
        setAppointmentDateTime(processedDateTime);
        setAppointmentNote(data.appointmentNote);
        setClientSpokenLanguage(data.clientSpokenLanguage);
        setInterpreterSpokenLanguage(data.interpreterSpokenLanguage);
        setLocationName(data.locationName);
        setLocationAddress(data.locationAddress);
        setLocationLatitude(data.locationLatitude);
        setLocationLongitude(data.locationLongitude);
    }
    useEffect(() => {
        getAppointmentDetail();
    }, []);

    // Update appointment information
    async function updateAppointment(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        const data = {
            appointmentTitle: appointmentTitle,
            appointmentType: appointmentType,
            clientSpokenLanguage: clientSpokenLanguage,
            interpreterSpokenLanguage: interpreterSpokenLanguage,
            locationName: locationName,
            locationAddress: locationAddress,
            locationLatitude: locationCoordinates?.lat, 
            locationLongitude: locationCoordinates?.lng,
            appointmentNote: appointmentNote,
        }
        console.log(data);
        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment`;
        await axios.put(url, data);
        alert("Appointment update successfully!");
        router.push(`/appointment-detail?appointmentId=${appointmentId}`);
    }

    return (
        <div>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <form onSubmit={updateAppointment}>
                <div className='add_request_box'>
                    <label className='add_request_label'>Title:</label>
                    <input 
                        type="text" 
                        value={appointmentTitle} 
                        onChange={(e) => setAppointmentTitle(e.target.value)} 
                        required 
                        className='add_request_input' 
                    />
                </div>
                <div className='add_request_box'>
                    <label className='add_request_label'>Date and Time:</label>
                    <input 
                    type="datetime-local" 
                    value={appointmentDateTime} 
                    onChange={(e) => setAppointmentDateTime(e.target.value)} 
                    required 
                    className='add_request_input' 
                    />
                </div>
                <div className='add_request_box'>
                    <label className='add_request_label'>
                    <input 
                        type="radio" 
                        name="interpretationType" 
                        value="videoChat" 
                        checked={appointmentType === "videoChat"} 
                        onChange={() => setAppointmentType("videoChat")} 
                        required 
                        className='add_request_radio' 
                    />
                    Video Chat Interpretation
                    </label>
                </div>
                <div className='add_request_box'>
                    <label className='add_request_label'>
                    <input 
                        type="radio" 
                        name="interpretationType" 
                        value="inPerson" 
                        checked={appointmentType === "inPerson"} 
                        onChange={() => setAppointmentType("inPerson")} 
                        required 
                        className='add_request_radio' 
                    />
                    In-person Interpretation
                    </label>
                </div>
                {appointmentType !== "videoChat" && (
                    <div className='add_request_box'>
                    <label className='add_request_label'>Location:</label>
                    <input 
                        type="text" 
                        value={locationName} 
                        onChange={(e) => setLocationName(e.target.value)} 
                        required 
                        className='add_request_input' 
                    />
                    </div>
                )}
            <div className='add_request_box'>
                <label className='add_request_label'>Desired Language:</label>
                <select 
                value={clientSpokenLanguage} 
                onChange={(e) => setClientSpokenLanguage(e.target.value)} 
                required 
                className='add_request_input' 
                >
                {languages.map((language) => (
                    <option key={language} value={language}>
                    {language}
                    </option>
                ))}
                </select>
            </div>
            <div className='add_request_box'>
                <label className='add_request_label'>Communication Language:</label>
                <select 
                value={interpreterSpokenLanguage} 
                onChange={(e) => setInterpreterSpokenLanguage(e.target.value)} 
                required 
                className='add_request_input' 
                >
                {languages.map((language) => (
                    <option key={language} value={language}>
                    {language}
                    </option>
                ))}
                </select>
            </div>
                <div className='add_request_box'>
                    <label className='add_request_label'>Memo:</label>
                    <textarea
                        value={appointmentNote}
                        onChange={(e) => setAppointmentNote(e.target.value)}
                        className='add_request_textarea'
                    ></textarea>
                </div>
                <div className="button_box">
                    <button type="submit" className='add_request_submit_button'>Confirm</button>
                </div>
            </form>
            <Link href={{
                pathname: '/appointment-detail',
                query: {
                    appointmentId: appointmentId,
                }
            }}>
                <button className='aadsf'>Cancel update</button>
            </Link>
        </div>
    )
}