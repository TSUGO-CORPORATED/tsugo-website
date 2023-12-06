'use client';

// MODULES IMPORT
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MapComponent from "../../map-component/map"

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
type MainCategoriesType = {
    [key: string]: string[];
  };

  function getLocalDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  const now = getLocalDateTime();

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
    const [dateTime, setDateTime] = useState(now);
    const [appointmentDateTime, setAppointmentDateTime] = useState<string>('');
    const [clientSpokenLanguage, setClientSpokenLanguage] = useState<string>("");
    const [interpreterSpokenLanguage, setInterpreterSpokenLanguage] = useState<string>("");
    const [appointmentType, setAppointmentType] = useState<string>("");
    const [appointmentNote, setAppointmentNote] = useState<string | number | readonly string[] | undefined>("");
    const [locationName, setLocationName] = useState<string >("");
    const [locationAddress, setLocationAddress] = useState<string | null>("");
    const [locationCoordinates, setLocationCoordinates] = useState<Coordinates | null>();
    const [locationLatitude, setLocationLatitude] = useState<string | number | null>();
    const [locationLongitude, setLocationLongitude] = useState<string | number | null>();
    const [error, setError] = useState("");
 

    useEffect(() => {
        setLocationName("");
      }, [appointmentType]);
      
    const apiKey = "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM";
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
        console.log("detail",data)

        const processedDateTime = data.appointmentDateTime.substring(0, 16);
        // appointmentTitle: appointmentTitle,
        setAppointmentTitle(data.appointmentTitle);
        // appointmentTitle: selectedMainCategory + "-" + selectedSubCategory,
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
            appointmentDateTime:appointmentDateTime,
            locationName: locationName,
            locationAddress: locationAddress,
            locationLatitude: locationCoordinates?.lat, 
            locationLongitude: locationCoordinates?.lng,
            appointmentNote: appointmentNote,
         
        }
        console.log("update",data);
        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment`;
        await axios.put(url, data);
        alert("Appointment update successfully!");
        router.push(`/appointment-detail?appointmentId=${appointmentId}`);
    }


    const fetchCoordinates = async (location: string) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              location
            )}&key=${apiKey}`
          );
          if (response.data.results.length === 0) {
            setError("No results found for the given location.");
            console.error("No results found:", response.data);
            return false;
          }
    
          const { lat, lng } = response.data.results[0].geometry.location;
          console.log({ lat, lng });
          setError("");
          setLocationCoordinates({ lat, lng });
          return true;
        } catch (error) {
          console.error("Error fetching coordinates: ", error);
          setError("Error fetching coordinates.");
          return false;
        }
      };
      const mainCategories: MainCategoriesType = {
        "Business": [
          "Company Visits",
          "Product Descriptions",
          "Market Research",
          "Training Sessions",
          "Internal Presentations",
          "Others",
        ],
        "Educational": [
          "School Education",
          "Universities and Colleges",
          "Academic Lectures",
          "Research Meetings",
          "Educational Programs",
          "Career Counseling",
          "Parent-Teacher Meetings",
          "Others",
        ],
        "Tourism": [
          "Tourist Guidance",
          "Travel Assistance",
          "Guided Tours",
          "Cultural Heritage",
          "Eco-Tourism",
          "Adventure Sports",
          "Shopping and Ordering in Tourism",
          "Others",
        ],
        "Communication": ["Phone", "Video", "Online Meetings", "Webinars", "Others"],
        "Culture and Arts": [
          "Art Exhibitions",
          "Museum Guiding",
          "Music Events",
          "Performing Arts",
          "Literature and Books",
          "Others",
        ],
        "Technical": [
          "Engineering",
          "IT and Software",
          "Scientific Research",
          "Manufacturing",
          "Environmental Technology",
          "Others",
        ],
        "Sports": [
          "Sports Events",
          "Athlete Support",
          "Interviews",
          "Sports Training",
          "Others",
        ],
        "Entertainment": [
          "Movies and TV Shows",
          "Entertainment Events",
          "Live Shows",
          "Games and Animation",
          "Celebrity Events",
          "Others",
        ],
        "Real Estate": [
          "Property Viewing and Tours",
          "Rental Agreements",
          "Real Estate Purchasing",
          "Mortgage Consulting",
          "Real Estate Law",
          "Others",
        ],
        "Municipal Services": [
          "Resident Registration and Civil Status Procedures",
          "Passport and ID Renewal",
          "Taxes and Local Tax Consultation",
          "Public Service Applications",
          "General Inquiries",
          "Others",
        ],
        "Police-Related": [
          "Lost Property Reports",
          "Traffic Accident Reports",
          "Minor Crime Victim Reports",
          "General Consultation and Information",
          "Others",
        ],
        "Hospital": [
          "General Medical Consultation",
          "Vaccination Procedures",
          "Health Consultation",
          "Regular Check-up Appointments",
          "Medication Explanation",
          "Others",
        ],
        "Language Learning": [
          "Language Classes",
          "Language Skill Development",
          "Language Learning Workshops",
          "Others",
        ],
        "Others": ["Others"],
      };
      const [selectedMainCategory, setSelectedMainCategory] = useState("Business");
      
      const [selectedSubCategory, setSelectedSubCategory] = useState(
        mainCategories["Business"][0]
      );

      const handleMainCategoryChange = (
        select: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const category = select.target.value;
        setSelectedMainCategory(category);
        setSelectedSubCategory(mainCategories[category][0]);
      };

      const fetchAddress = async () => {
        if (!locationCoordinates) return;
    
        const { lat, lng } = locationCoordinates;
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
          );
    
          if (response.data.results.length === 0) {
            setError("No address found for the given coordinates.");
            console.error("No address found:", response.data);
            return;
          }
    
          const fetchedAddress = response.data.results[0].formatted_address;
          console.log(fetchedAddress);
          setLocationAddress(fetchedAddress);
        } catch (error) {
          console.error("Error fetching address: ", error);
          setError("Error fetching address.");
        }
      };


      const handleLocationSearch = async () => {
        const coordinatesFetched = await fetchCoordinates(locationName);
        if (coordinatesFetched) {
          await fetchAddress();
        }
      };
    
      useEffect(() => {
        if (locationCoordinates) {
          fetchAddress();
        }
      }, [locationCoordinates]);

    return (
        <div>

            <form onSubmit={updateAppointment}>
                {/* <div className='add_request_box'>
                    <label className='add_request_label'>Title:</label>
                    <input 
                        type="text" 
                        value={appointmentTitle} 
                        onChange={(e) => setAppointmentTitle(e.target.value)} 
                        required 
                        className='add_request_input' 
                    />
                </div> */}
                <div className="add_request_box">
              <label className="add_request_label">Main Category:</label>
              <select
                value={selectedMainCategory}
                onChange={handleMainCategoryChange}
                required
                className="add_request_input"
              >
                {Object.keys(mainCategories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="add_request_box">
              <label className="add_request_label">Sub Category:</label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                required
                className="add_request_input"
              >
                {mainCategories[selectedMainCategory].map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
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
                <div className="add_request_box">
              <label className="add_request_label">Date and Time:</label>
              <input
                type="datetime-local"
                value={appointmentDateTime}
                onChange={(e) => setAppointmentDateTime(e.target.value)}
                min={dateTime}
                required
                className="add_request_input"
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
              <>
                <div className="add_request_box">
                  <label className="add_request_label">Location:</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Enter Adress or Location(e.g. TokyoStation)"
                    required
                    className="add_request_input"
                  />
                   {error && <div className="add_request_error_message">{error}</div>}
                </div>
                <button
                  className="add_request_search_location_button"
                  onClick={handleLocationSearch}
                >
                  Search Location
                </button>
                {locationCoordinates && (
                  <div className="add_request_map_container">
  
                    <MapComponent coordinates={locationCoordinates} />
                  
                  </div>
                )}
              </>
            )}
              <div className="add_request_address_display">{locationAddress}</div>
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

                <div className="button_box">
                    <button type="submit" className='add_request_submit_button'>Confirm</button>
            
              <Link href={{
                pathname: '/appointment-detail',
                query: {
                    appointmentId: appointmentId,
                }
            }}>
                <button className='add_request_submit_button'>Cancel update</button>
            </Link>   
             </div>
            </form>

        </div>
    )
}