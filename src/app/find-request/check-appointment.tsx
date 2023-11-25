"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type Appointment = {
    id: number;
    status: string;
    clientUserId: number;
    clientSpokenLanguage: string;
    clientDesiredLanguage: string;
    translatorUserId: number | null; 
    translatorLanguage: string | undefined; 
    locationLatitude: number | null; 
    locationLongitude: number | null; 
    appointmentDateTime: string;
    appointmentNote: string; 
    reviewRating: number | null; 
    reviewNote: string | null; 
    location: string | undefined;
    hospitalType: string;
    title: string;
    interpretationType:string,
  };


export default function FindRequest() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedType, setSelectedType] = useState('all');
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [currentPosition, setCurrentPosition] = useState({ lat: 35.6895, lng: 139.6917 });
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || "FAKE_API_KEY";
    
    useEffect(() => {
        const fetchAppointments = async () => {
          try {
            const response = await axios.get('FAKE_API_URL');
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

      const showDetails = (id: number) => {
        setSelectedAppointmentId(selectedAppointmentId === id ? null : id);
      };
      
      const filteredAppointments = appointments.filter((appointment) =>
      selectedType === 'all' || appointment.interpretationType === selectedType
    );

      const mapContainerStyle = {
        width: "100%",
        height: "400px",
      };

    return (
        <div>
            <h1>Check Appointments</h1>
        <div>
            
            <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentPosition}
          zoom={10} 
        >
          {appointments.map((appointment) => (
            appointment.locationLatitude && appointment.locationLongitude && (
            <Marker
            // need to put detail on popup
              key={appointment.id}
              position={{ lat: appointment.locationLatitude, lng: appointment.locationLongitude }}
            /> )
          ))}
        </GoogleMap>
      </LoadScript>
      <div>
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
        <div>
        {appointments.map((appointment) => (
          <div key={appointment.id} onClick={() => showDetails(appointment.id)}>
            <h2>{appointment.title}</h2>
            <p>Date and Time: {appointment.appointmentDateTime}</p>
            <p>Hospital Type: {appointment.hospitalType}</p>
            <p>Interpretation Type: {appointment.interpretationType}</p>
            <p>Client Spoken Language: {appointment.clientSpokenLanguage}</p>
            <p>Client Desired Language: {appointment.clientDesiredLanguage}</p>
  
            {selectedAppointmentId === appointment.id && (
              <div>
                {appointment.location && <p>Location: {appointment.location}</p>}
                {appointment.appointmentNote && <p>Note: {appointment.appointmentNote}</p>}
                {appointment.reviewRating != null && <p>Rating: {appointment.reviewRating}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
      </div>
    );
}