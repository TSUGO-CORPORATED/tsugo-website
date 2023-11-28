'use client';
import React, { useState, useContext } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useRouter } from 'next/navigation';
import { ContextVariables } from "../../context-variables";

type Coordinates = { lat: number; lng: number; } | null;
type StatusFilter = "Requesting" | "Accepted" | "Cancelled" | "Completed" | "";
const CreateAppointment = () => {
  const router = useRouter();
  const { userId } = useContext(ContextVariables);

  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [desireLanguage, setDesireLanguage] = useState("Japanese");
  const [communicateLanguage, setCommunicateLanguage] = useState("English");
  const [appointmentType, setAppointmentType] = useState("videoChat");
  const [note, setNote] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState<Coordinates>(null);
  const [error, setError] = useState("");

  //this is my apikey for temporary but its not working !!
  const apiKey = "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM"
  // const apiKey = process.env.REACT_APP_GOOGLE_API_KEY as string;
  const fetchCoordinates = async (location: string) => {
    try {

      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`);
     
      if (response.data.results.length === 0) {
        setError("No results found for the given location.");
        console.error("No results found:", response.data);
        return;
      }
  
      const { lat, lng } = response.data.results[0].geometry.location;
      console.log({ lat, lng })
      setLocationCoordinates({ lat, lng });
    } catch (error) {
      console.error("Error fetching coordinates: ", error);
      setError("Error fetching coordinates.");
    }
  };

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


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!isAgreed) {
      alert("Please agree to the disclaimer before requesting.");
      return;
    }

    if (appointmentType === 'inPerson' && location) {
      await fetchCoordinates(location);
    }
    setIsConfirmed(true);
  };

  const handleSendRequest = async () => {
    try {
        const convertedDateTime: string = (new Date(dateTime)).toISOString();
        const requestData = {
          appointmentTitle: appointmentTitle,
          appointmentType: appointmentType,
          clientUserId: userId, 
          clientSpokenLanguage: communicateLanguage, 
          interpreterSpokenLanguage: desireLanguage, 
          locationLatitude: locationCoordinates?.lat, 
          locationLongitude: locationCoordinates?.lng, 
          locationName: location, 
          appointmentDateTime: convertedDateTime, 
          appointmentNote: note,    
      };
      console.log(requestData);
      await axios.post("https://senior-project-server-8090ce16e15d.herokuapp.com/appointment", requestData);
      alert("Request sent successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error sending request: ", error);
      setError("Error sending request.");
    }
  };

  if (!isConfirmed) {
    return (
      <div className='add_request'>
        <h1 className='add_request_title'>Make an Appointment</h1>
        <form onSubmit={handleSubmit} className='add_request_form'>
          {/* Form fields */}
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
              value={dateTime} 
              onChange={(e) => setDateTime(e.target.value)} 
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
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                required 
                className='add_request_input' 
              />
            </div>
          )}
       <div className='add_request_box'>
        <label className='add_request_label'>Desired Language:</label>
        <select 
          value={desireLanguage} 
          onChange={(e) => setDesireLanguage(e.target.value)} 
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
          value={communicateLanguage} 
          onChange={(e) => setCommunicateLanguage(e.target.value)} 
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
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className='add_request_textarea'
            ></textarea>
          </div>
          <div className='add_request_box'>
            <label className='add_request_label'>
              <input 
                type="checkbox" 
                checked={isAgreed} 
                onChange={(e) => setIsAgreed(e.target.checked)} 
                required 
                className='add_request_checkbox' 
              />
              I agree to the Disclaimer
            </label>
          </div>
          <button type="submit" className='add_request_submit_button'>Confirm</button>
          <button type="button" className='add_request_cancel_button' onClick={() => router.push('/dashboard')}>Cancel</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Appointment Confirmation</h1>
        <p>Title: {appointmentTitle}</p>
        <p>Date and Time: {dateTime}</p>
        <p>Location: {location}</p>
        <p>Desired Language: {desireLanguage}</p>
        <p>Communication Language: {communicateLanguage}</p>
        <p>Interpretation Type: {appointmentType}</p>
        <p>Memo: {note}</p>
        {locationCoordinates && (
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={{ width: '400px', height: '400px' }}
              center={{ lat: locationCoordinates.lat, lng: locationCoordinates.lng }}
              zoom={17}
            >
              <Marker position={{ lat: locationCoordinates.lat, lng: locationCoordinates.lng }} />
            </GoogleMap>
          </LoadScript>
        )}
        <button onClick={handleSendRequest}>Send Request</button>
        <button onClick={() => setIsConfirmed(false)}>Back to Form</button>
      </div>
    );
  }
};

export default CreateAppointment;

