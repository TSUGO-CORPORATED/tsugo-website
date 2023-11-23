"use client";
import React, { useState } from "react";
import axios from "axios";

type Coordinates = {
    lat: number;
    lng: number;
};

export default function UserClientAppointment() {
    const [title, setTitle] = useState("");
    const [hospital, setHospital] = useState("内科/Internal Medicine");
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [desireLanguage, setDesireLanguage] = useState("Japanese");
    const [communicateLanguage, setCommunicateLanguage] = useState("English");
    const [isAgreed, setIsAgreed] = useState(false);
    const [interpretationType, setInterpretationType] = useState("videoChat");
    const [locationCoordinates, setLocationCoordinates] = useState<Coordinates | null>(null);
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
    };

    return (
        <div>
            <h1>Make an Appointment</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <select
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        required
                    >
                        {hospitalTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Date and Time:</label>
                    <input
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="interpretationType"
                            value="videoChat"
                            checked={interpretationType === "videoChat"}
                            onChange={() => setInterpretationType("videoChat")}
                            required
                        />
                        Video Chat Interpretation
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="interpretationType"
                            value="inPerson"
                            checked={interpretationType === "inPerson"}
                            onChange={() => setInterpretationType("inPerson")}
                            required
                        />
                        In-person Interpretation
                    </label>
                </div>
                {interpretationType !== "videoChat" && (
                    <div>
                        <label>Location:</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div>
                    <label>Desired Language:</label>
                    <select
                        value={desireLanguage}
                        onChange={(e) => setDesireLanguage(e.target.value)}
                        required
                    >
                        {languages.map((language) => (
                            <option key={language} value={language}>
                                {language}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Communication Language:</label>
                    <select
                        value={communicateLanguage}
                        onChange={(e) => setCommunicateLanguage(e.target.value)}
                        required
                    >
                        {languages.map((language) => (
                            <option key={language} value={language}>
                                {language}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            required
                        />
                        I agree to the Disclaimer
                    </label>
                </div>
                <button type="submit">Send Request</button>
            </form>
        </div>
    );
}
