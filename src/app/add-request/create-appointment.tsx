"use client";
import Link from 'next/link';
import React, { useState } from "react";
import axios from "axios";
import { useRouter, } from 'next/navigation';

type Coordinates = {
    lat: number;
    lng: number;
};

export default function UserClientAppointment() { 
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [hospital, setHospital] = useState("内科/Internal Medicine");
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [desireLanguage, setDesireLanguage] = useState("Japanese");
    const [communicateLanguage, setCommunicateLanguage] = useState("English");
    const [isAgreed, setIsAgreed] = useState(false);
    const [interpretationType, setInterpretationType] = useState("videoChat");
    const [locationCoordinates, setLocationCoordinates] = useState<Coordinates | null>(null);
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
   

    const fetchCoordinates = async (location: string) => {
        const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
    
        const response = await axios.get(apiUrl);
        if (response.data.results.length === 0) {
            throw new Error("No results found");
        }
    
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
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

    const hospitalTypes = [
        "内科/Internal Medicine",
        "外科/Surgery",
        "小児科/Pediatrics",
        "産婦人科/Obstetrics and Gynecology",
        "眼科/Ophthalmology",
        "耳鼻咽喉科/Otolaryngology",
        "皮膚科/Dermatology",
        "整形外科/Orthopedics",
        "精神科/Psychiatry",
        "神経科/Neurology",
        "泌尿器科/Urology",
        "循環器科/Cardiology",
        "消化器科/Gastroenterology",
        "呼吸器科/Pulmonology",
        "アレルギー科/Allergology",
        "歯科/Dentistry",
        "健康診断/Health Screening",
        "予防接種/Immunization",
    ];

    const handleSubmit = async  (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        if (!isAgreed) {
            alert("Please agree to the disclaimer before requesting.");
            return;
        }

        if (interpretationType !== "videoChat" && !location) {
            alert("Please enter a location.");
            return;
        }
        // in future not alert, error
        if (interpretationType === 'inPerson' && location) {
            try {
                const coordinates = await fetchCoordinates(location);
                setLocationCoordinates(coordinates)
                console.log("Coordinates:", coordinates); 
            } catch (error) {
                setError("Error fetching location coordinates.");
                return;
            }
        }
        const formData = {
            title,
            hospital,
            dateTime,
            location,
            desireLanguage,
            communicateLanguage,
            interpretationType,
            note,
            lat: locationCoordinates?.lat.toString(),
            lng: locationCoordinates?.lng.toString(),
          };
          // router.push({
          //   pathname: '/request-confirmation',
          //   query: {
          //     title: formData.title,
          //     hospital: formData.hospital,
          //     dateTime: formData.dateTime,
          //     location: formData.location,
          //     desireLanguage: formData.desireLanguage,
          //     communicateLanguage: formData.communicateLanguage,
          //     interpretationType: formData.interpretationType,
          //     note: formData.note,
          //     lat: locationCoordinates?.lat?.toString() || '',
          //     lng: locationCoordinates?.lng?.toString() || '',
          //   },
          // });
        }

    return (
<div className='add_request'>
    <h1 className='add_request_title'>Make an Appointment</h1>
    <form onSubmit={handleSubmit} className='add_request_form'>
      <div className='add_request_box'>
        <label className='add_request_label'>Title:</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className='add_request_input' 
        />
      </div>
      <div className='add_request_box'>
        <label className='add_request_label'>Category:</label>
        <select 
          value={hospital} 
          onChange={(e) => setHospital(e.target.value)} 
          required 
          className='add_request_input' 
        >
          {hospitalTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
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
            checked={interpretationType === "videoChat"} 
            onChange={() => setInterpretationType("videoChat")} 
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
            checked={interpretationType === "inPerson"} 
            onChange={() => setInterpretationType("inPerson")} 
            required 
            className='add_request_radio' 
          />
          In-person Interpretation
        </label>
      </div>
      {interpretationType !== "videoChat" && (
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
      <button type="submit" className='add_request_submit_button'>Send Request</button>
        <Link href="/dashboard">
            <button className='add_request_cancel_button'>Cancel</button>
        </Link>
    </form>
  </div>
    );
}
