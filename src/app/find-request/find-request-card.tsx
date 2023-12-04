"use client";
import React, { useEffect, useState, useContext  } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { ContextVariables } from "../../context-variables";
import AppointmentBlock from '../global/appointment-block';
import MapComponent from "../map-component/map"

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
    locationAdress : string;
    appointmentCategory: string;
};



type Coordinate = {
    lat: number;
    lng: number;
  };

export default function FindRequestCard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedType, setSelectedType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPosition, setCurrentPosition] = useState({
    lat: 35.6895,
    lng: 139.6917,
  });
  const [selectedInterpreterLanguage, setSelectedInterpreterLanguage] = useState('');
  const [selectedClientLanguage, setSelectedClientLanguage] = useState('');
  const languages = [
    "Japanese", "English", "Mandarin Chinese", "Hindi", "Spanish",
    "French", "Arabic", "Russian", "Portuguese", "Indonesian",
    "Korean", "Italian", "German", "Telugu", "Vietnamese", "Turkish"
];


  const apiKey =
    process.env.REACT_APP_GOOGLE_API_KEY ||
    "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM";
  const { userId } = useContext(ContextVariables);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/find/${userId}`
        );

        setAppointments(response.data);
        console.log("lists", response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
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

  const filteredAppointments = appointments.filter((appointment) => {

    const timeFilter =  new Date(appointment.appointmentDateTime) > new Date(now);
    const typeFilter = selectedType === 'all' || appointment.appointmentType === selectedType;
    const keywordFilter = (
        appointment.status?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        appointment.appointmentTitle?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        appointment.clientSpokenLanguage?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        appointment.interpreterSpokenLanguage?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        appointment.locationName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        appointment.locationAdress?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        appointment.appointmentCategory?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    const languageFilter = (
        (selectedInterpreterLanguage === '' || appointment.interpreterSpokenLanguage === selectedInterpreterLanguage) &&
        (selectedClientLanguage === '' || appointment.clientSpokenLanguage === selectedClientLanguage)
    );

    return typeFilter && keywordFilter && languageFilter;

});


  const mapSize = {
    width: "100%",
    height: "400px",
  };

  const mapCoordinates = appointments
    .map((appointment) => {
      if (
        appointment.locationLatitude != null &&
        appointment.locationLongitude != null
      ) {
        return {
          lat: Number(appointment.locationLatitude),
          lng: Number(appointment.locationLongitude),
        };
      }
      return null;
    })
    .filter((coord) => coord !== null) as Coordinate[];
  console.log("findTSX", mapCoordinates);

  const popUpAppointments = appointments.filter(
    (appointment) => appointment.appointmentType === "inPerson"
  );
  console.log("popupAppo", popUpAppointments);

    return (
        <div className="find-request__card">
            <div className="find-request__card__header">Check Appointments</div>
            <div className="find-request__card__map-container">
                {/* <LoadScript googleMapsApiKey={apiKey}>
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
                </LoadScript> */}
                <MapComponent appointments={popUpAppointments} />
            </div>
            <div className="find-request__card__search">
                <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>
            <div className="find-request__card__filter">
                <label>
                    <input
                        type="radio"
                        name="interpretationType"
                        value="all"
                        checked={selectedType === "all"}
                        onChange={() => setSelectedType("all")}
                    />
                    All
                </label>
                <label>
                    <input
                        type="radio"
                        name="interpretationType"
                        value="videoChat"
                        checked={selectedType === "videoChat"}
                        onChange={() => setSelectedType("videoChat")}
                    />
                    Video Chat
                </label>
                <label>
                    <input
                        type="radio"
                        name="interpretationType"
                        value="inPerson"
                        checked={selectedType === "inPerson"}
                        onChange={() => setSelectedType("inPerson")}
                    />
                    In-person
                </label>
            </div>
            <div className='find-request__card__language-filter'>
                <select
                    value={selectedInterpreterLanguage}
                    onChange={(e) => setSelectedInterpreterLanguage(e.target.value)}
                >
                    <option value="">Select Interpreter Language</option>
                    {languages.map(language => <option key={language} value={language}>{language}</option>)}
                </select>
                <select
                    value={selectedClientLanguage}
                    onChange={(e) => setSelectedClientLanguage(e.target.value)}
                >
                    <option value="">Select Your Language</option>
                    {languages.map(language => <option key={language} value={language}>{language}</option>)}
                </select>
            </div>
            <div className="find-request__card__appointment-container">
                <AppointmentBlock appointment={filteredAppointments} />
            </div>
        </div>
    );
}