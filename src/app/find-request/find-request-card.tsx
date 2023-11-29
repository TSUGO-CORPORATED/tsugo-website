"use client";
import React, { useEffect, useState, useContext  } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { ContextVariables } from "../../context-variables";
import AppointmentBlock from '../global/appointment-block';

type Appointment = {
    id: number;
    status: string;
    appointmentTitle: string,
    appointmentType: string,
    clientSpokenLanguage: string;
    interpreterSpokenLanguage: string;
    locationName: string;
    locationLatitude: number;
    locationLongitude: number;
    appointmentDateTime: Date;
};

export default function FindRequestCard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedType, setSelectedType] = useState('all');
    const [currentPosition, setCurrentPosition] = useState({ lat: 35.6895, lng: 139.6917 });
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY ||  "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM";
    const { userId } = useContext(ContextVariables);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {

                const response = await axios.get(`https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/find/${userId}`);

                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
        fetchAppointments();
      }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                });
            },
            () => {
                console.error("Faild to get your Geolocation .");
            }
            );
        }
    }, []);


      
    const filteredAppointments = appointments.filter((appointment) =>
        selectedType === 'all' || appointment.appointmentType === selectedType
    );

    const mapSize = {
        width: "100%",
        height: "400px",
    };

    return ( 
        <div className='find-request__card'>
            <div className='find-request__card__header'>Check Appointments</div>
            <div className='find-request__card__map-container'>
                <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                        mapContainerStyle={mapSize}
                        center={currentPosition}
                        zoom={14} 
                    >
                        {appointments.map((appointment) => (
                            appointment.locationLatitude && appointment.locationLongitude && (
                            <Marker
                            // need to put detail on popup
                            key={appointment.id}
                            position={{ lat: Number(appointment.locationLatitude), lng: Number(appointment.locationLongitude) }}
                            /> )
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
            <div className='find-request__card__filter'>
                <label>
                    <input
                        type="radio"
                        name="interpretationType"
                        value="all"
                        checked={selectedType === 'all'}
                        onChange={() => setSelectedType('all')}
                    />
                        All
                </label>
                <label>
                    <input
                        type="radio"
                        name="interpretationType"
                        value="videoChat"
                        checked={selectedType === 'videoChat'}
                        onChange={() => setSelectedType('videoChat')}
                    />
                        Video Chat
                </label>
                <label>
                    <input
                        type="radio"
                        name="interpretationType"
                        value="inPerson"
                        checked={selectedType === 'inPerson'}
                        onChange={() => setSelectedType('inPerson')}
                    />
                        In-person
                </label>
            </div>
            <div className='find-request__card__appointment-container'>
                <AppointmentBlock appointment={filteredAppointments}/>
            </div>
        </div>
    );
}