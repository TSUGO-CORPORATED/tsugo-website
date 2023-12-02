'use client';
import React, { useState, useContext,useEffect } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker,useLoadScript } from "@react-google-maps/api";
import { Autocomplete } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { ContextVariables } from "../../context-variables";
import MapComponent from "../map-component/map"

type Coordinates = { lat: number; lng: number; } | null;
type StatusFilter = "Requesting" | "Accepted" | "Cancelled" | "Completed" | "";
type MainCategoriesType = {
  [key: string]: string[];
};

const CreateAppointment = () => {
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
  const router = useRouter();
  const { userId } = useContext(ContextVariables);

  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [dateTime, setDateTime] = useState(now);
  const [location, setLocation] = useState("");
  const [desireLanguage, setDesireLanguage] = useState("Japanese");
  const [communicateLanguage, setCommunicateLanguage] = useState("English");
  const [appointmentType, setAppointmentType] = useState("videoChat");
  const [note, setNote] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [locationCoordinates, setLocationCoordinates] =
    useState<Coordinates>(null);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const libraries = ["places"];
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    setLocation("");
  }, [appointmentType]);

  //   //this is my apikey for temporary but its not working !!
  const apiKey = "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM";
  //   const BapiKey = "AiNzDpY3NAhheYg6ki_c1XODOJIpHW654zRFilGaUxmxn5z32VZICRAonbXUupsL"
  //   const { isLoaded, loadError } = useLoadScript({
  //     googleMapsApiKey: apiKey,
  //     // libraries,
  //   });
  //   if (loadError) return <div>Error loading maps</div>;
  //  if (!isLoaded) return <div>Loading Maps...</div>;

  // const apiKey = process.env.REACT_APP_GOOGLE_API_KEY as string;
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
        return;
      }

      const { lat, lng } = response.data.results[0].geometry.location;
      console.log({ lat, lng });
      setError("");
      setLocationCoordinates({ lat, lng });
    } catch (error) {
      console.error("Error fetching coordinates: ", error);
      setError("Error fetching coordinates.");
    }
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
      setAddress(fetchedAddress);
    } catch (error) {
      console.error("Error fetching address: ", error);
      setError("Error fetching address.");
    }
  };

  const handleLocationSearch = async () => {
    await fetchCoordinates(location);
    await fetchAddress();
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!isAgreed) {
      alert("Please agree to the disclaimer before requesting.");
      return;
    }
    if (appointmentType === "inPerson" && location) {
      // await fetchCoordinates(location);
      // await handleLocationSearch()
      await fetchAddress();
    }
    setIsConfirmed(true);
  };

  const handleSendRequest = async () => {
    try {
      const convertedDateTime: string = new Date(dateTime).toISOString();
      const requestData = {
        // appointmentTitle: appointmentTitle,
        appointmentTitle: selectedMainCategory + "-" + selectedSubCategory,
        appointmentType: appointmentType,
        appointmentCategory:selectedMainCategory+"-"+selectedSubCategory,
        clientUserId: userId,
        clientSpokenLanguage: communicateLanguage,
        interpreterSpokenLanguage: desireLanguage,
        locationLatitude: locationCoordinates?.lat,
        locationLongitude: locationCoordinates?.lng,
        locationName: location,
        appointmentDateTime: convertedDateTime,
        appointmentNote: note,
        locationAddress: address,
      };
      console.log("reqData", requestData);
      await axios.post(
        "https://senior-project-server-8090ce16e15d.herokuapp.com/appointment",
        requestData
      );
      alert("Request sent successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error sending request: ", error);
      setError("Error sending request.");
    }
  };

  if (!isConfirmed) {
    return (
      <div className="add_request">
        <div className="add_request_container">
          <h1 className="add_request_title">Make an Appointment</h1>
          <form onSubmit={handleSubmit} className="add_request_form">
            {/* Form fields */}

            {/* <div className="add_request_box">
              <label className="add_request_label">Title:</label>
              <input
                type="text"
                value={appointmentTitle}
                onChange={(e) => setAppointmentTitle(e.target.value)}
                required
                className="add_request_input"
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
            <div className="add_request_box">
              <label className="add_request_label">Memo:</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Please enter any additional information here..."
                className="add_request_textarea"
              ></textarea>
            </div>
            <div className="add_request_box">
              <label className="add_request_label">Date and Time:</label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                min={dateTime}
                required
                className="add_request_input"
              />
            </div>
            <div className="add_request_box">
              <label className="add_request_label">
                <input
                  type="radio"
                  name="interpretationType"
                  value="videoChat"
                  checked={appointmentType === "videoChat"}
                  onChange={() => setAppointmentType("videoChat")}
                  required
                  className="add_request_radio"
                />
                Video Chat Interpretation
              </label>
            </div>
            <div className="add_request_box">
              <label className="add_request_label">
                <input
                  type="radio"
                  name="interpretationType"
                  value="inPerson"
                  checked={appointmentType === "inPerson"}
                  onChange={() => setAppointmentType("inPerson")}
                  required
                  className="add_request_radio"
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                    {/* <LoadScript googleMapsApiKey={apiKey}>
              <GoogleMap
                mapContainerStyle={{ width: '300px', height: '300px' }}
                center={{ lat: locationCoordinates.lat, lng: locationCoordinates.lng }}
                zoom={17}
              >
                <Marker position={{ lat: locationCoordinates.lat, lng: locationCoordinates.lng }} />
              </GoogleMap>
            </LoadScript> */}
                    <MapComponent coordinates={locationCoordinates} />
                    <div className="add_request_address_display">{address}</div>
                  </div>
                )}
              </>
            )}
            <div className="add_request_box">
              <label className="add_request_label">Desired Language:</label>
              <select
                value={desireLanguage}
                onChange={(e) => setDesireLanguage(e.target.value)}
                required
                className="add_request_input"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <div className="add_request_box">
              <label className="add_request_label">
                Communication Language:
              </label>
              <select
                value={communicateLanguage}
                onChange={(e) => setCommunicateLanguage(e.target.value)}
                required
                className="add_request_input"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div className="add_request_box">
              <label className="add_request_label">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  required
                  className="add_request_checkbox"
                />
                <span className="add_request_agree">
                  I agree to the Disclaimer
                </span>
              </label>
            </div>
            <div className="add_request_button_box">
              <button type="submit" className="add_request_submit_button">
                Confirm
              </button>
              <button
                type="button"
                className="add_request_cancel_button"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="confirm_section">
        <div className="confirm_section_container">
          <h2 className="confirm_title">Appointment Confirmation</h2>
          {/* <p className="confirm_detail">
            Title:{" "}
            <span className="confirm_appointmentTitle">{appointmentTitle}</span>{" "}
          </p> */}
          <p className="confirm_detail">
            Category: <span className="confirm_dateTime">{selectedMainCategory}-{selectedSubCategory}</span>{" "}
          </p>
          <p className="confirm_detail">
            Date and Time: <span className="confirm_dateTime"> {dateTime}</span>{" "}
          </p>
          <p className="confirm_detail">
            Location: <span className="confirm_location"> {location}</span>
          </p>
          <p className="confirm_detail">
            Adress: <span className="confirm_adress"> {address}</span>
          </p>
          <p className="confirm_detail">
            Desired Language:{" "}
            <span className="confirm_desire">{desireLanguage}</span>{" "}
          </p>
          <p className="confirm_detail">
            Communication Language:{" "}
            <span className="confirm_communication">
              {" "}
              {communicateLanguage}
            </span>
          </p>
          <p className="confirm_detail">
            Interpretation Type:{" "}
            <span className="confirm_type">{appointmentType}</span>{" "}
          </p>
          <p className="confirm_detail">
            Memo: <span className="confirm_note">{note}</span>{" "}
          </p>
          <div className="confirm_button_box">
            <button onClick={handleSendRequest} className="confirm_send_btn">
              Send Request
            </button>
            <button
              onClick={() => setIsConfirmed(false)}
              className="confirm_back_button"
            >
              Back to Form
            </button>
          </div>
        </div>
      </div>
    );
  }
};
export default CreateAppointment;

