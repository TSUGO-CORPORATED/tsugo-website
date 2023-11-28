"use client";
import React, { useEffect, useState, useContext  } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ContextVariables } from "../../context-variables";
import Link from 'next/link';

type Appointment = {
    id: number;
    status: string;
    clientUserId: number;
    clientSpokenLanguage: string;
    interpreterSpokenLanguage: string;
    translatorUserId: number | null; 
    translatorLanguage: string | undefined; 
    locationLatitude: number | null; 
    locationLongitude: number | null; 
    appointmentDateTime: string;
    appointmentNote: string; 
    reviewRating: number | null; 
    reviewNote: string | null; 
    location: string | undefined;
    appointmentTitle: string;
    appointmentType:string,
  };


export default function FindRequest() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedType, setSelectedType] = useState('all');
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [currentPosition, setCurrentPosition] = useState({ lat: 35.6895, lng: 139.6917 });
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY ||  "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM";
    const { userId } = useContext(ContextVariables);

    useEffect(() => {
        const fetchAppointments = async () => {
          try {
            // console.log(userId)
            const url ="https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/find/"+userId
            // console.log(url)
            const response = await axios.get(url);
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

      const timeConvert =(isoDateString : string)=>{
        const dateObject = new Date(isoDateString);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; 
        const day = dateObject.getDate();
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          return formattedDate      
        }

      const showDetails = (id: number) => {
        setSelectedAppointmentId(selectedAppointmentId === id ? null : id);
      };
      
      const filteredAppointments = appointments.filter((appointment) =>
      selectedType === 'all' || appointment.appointmentType === selectedType
    );

      const mapSize = {
        width: "100%",
        height: "400px",
      };

      const handleAcceptRequest = async (appointmentId: number) => {
        try {
          const url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/accept/${appointmentId}/${userId}`;
          await axios.patch(url);
          alert("Appointment accepted successfully!");
      
        
          const updatedAppointments = appointments.map(appointment =>
            appointment.id === appointmentId ? { ...appointment, status: "Ongoing" } : appointment
          );
          setAppointments(updatedAppointments);
        } catch (error) {
          console.error("Error accepting appointment: ", error);
          alert("Failed to accept appointment.");
        }
      };


    return ( 
        <div className='find_request_container'>
            <h1 className='find_request_header'>Check Appointments</h1>
        <div className='map_container'>
            
            <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapSize}
          center={currentPosition}
          zoom={10} 
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
        <div className='appointment-container'>
        {filteredAppointments.map((appointment) => (
          <div className='appointment-container__appointment' key={appointment.id} onClick={() => showDetails(appointment.id)}>
             <h2>{appointment.appointmentTitle}</h2>
            <p>Date and Time: {timeConvert(appointment.appointmentDateTime)}</p>           
            <p>Interpretation Type: {appointment.appointmentType}</p>
            <p>Client Spoken Language: {appointment.clientSpokenLanguage}</p>
            <p>Client Desired Language: {appointment.interpreterSpokenLanguage}</p>
  
            {selectedAppointmentId === appointment.id && (
              <div>
                <Link href={{
                  pathname: '/appointment-detail',
                  query: {slug: appointment.id}
                }}><button>More Details</button></Link>
                {/* {appointment.location && <p>Location: {appointment.location}</p>}
                {appointment.appointmentNote && <p>Note: {appointment.appointmentNote}</p>}
                {appointment.reviewRating != null && <p>Rating: {appointment.reviewRating}</p>}
                <button key={appointment.id} onClick={() => handleAcceptRequest(appointment.id)}>Accept</button> */}
              </div>
              // <div>
              //   {appointment.location && <p>Location: {appointment.location}</p>}
              //   {appointment.appointmentNote && <p>Note: {appointment.appointmentNote}</p>}
              //   {appointment.reviewRating != null && <p>Rating: {appointment.reviewRating}</p>}
              //   <button key={appointment.id} onClick={() => handleAcceptRequest(appointment.id)}>Accept</button>
              // </div>
            )}
          </div>
        ))}
      </div>
      </div>
      </div>
    );
}