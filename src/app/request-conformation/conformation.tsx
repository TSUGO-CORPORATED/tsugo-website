"use client";
import { useRouter } from "next/router";
import React, { useEffect, useContext } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
//for userID temporary
import { ContextVariables } from "../../context-variables";

const { userId } = useContext(ContextVariables);
export default function Confirmation() {
  const router = useRouter();
  const { query } = router;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  //this can be erased
  useEffect(() => {
    console.log(query);
  }, [query]);

  const handleBackToForm = () => {
    router.push("/add-request/page");
  };

  const handleSendRequest = async () => {
    try {
      let { lat, lng} = query;
      lat = Array.isArray(query.lat) ? query.lat[0] : query.lat;
      lng = Array.isArray(query.lng) ? query.lng[0] : query.lng;

      const requestData = {
        status: "waiting",
        title:query.title,
        clientUserId: userId,
        clientSpokenLanguage: query.communicateLanguage,
        clientDesiredLanguage: query.desireLanguage,
        translatorUserld: null,
        translatorLanguage: undefined,
        locationLatitude: lat ? parseFloat(lat) : null,
        locationLongitude: lng ? parseFloat(lng) : null,
        appointmentDateTime: query.dateTime,
        appointmentNote: query.memo,
        reviewRating: null,
        reviewNote: undefined,
        location: query.location,
        hospitaltypes: query.hospital,
        interpretationType:query.interpretationType,
      };

      const response = await axios.post("FakeAPI", requestData);
      console.log(response.data);
      alert("Request sent!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const mapContainerStyle = {
    width: "300px",
    height: "300px",
  };

  const lat = Array.isArray(query.lat) ? query.lat[0] : query.lat;
  const lng = Array.isArray(query.lng) ? query.lng[0] : query.lng;

  const triggerDisplayMap =
    query.interpretationType !== "videoChat" && lat && lng;

  const center = {
    lat: triggerDisplayMap ? parseFloat(lat) : 0,
    lng: triggerDisplayMap ? parseFloat(lng) : 0,
  };

  return (
    <div>
      <h1>Appointment Confirmation</h1>
      <p>Title: </p>
      <p>{query.title}</p>
      <p>Hospital: </p>
      <p>{query.hospital}</p>
      <p>Date and Time: </p>
      <p>{query.dateTime}</p>
      <p>Location: </p>
      <p>{query.location}</p>
      <p>Desired Language: </p>
      <p>{query.desireLanguage}</p>
      <p>Communication Language: </p>
      <p>{query.communicateLanguage}</p>
      <p>Interpretation Type: </p>
      <p>{query.interpretationType}</p>
      {triggerDisplayMap && (
        <>
          <p>location</p>
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={8}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </>
      )}
      <p>Memo: </p>
      <p>{query.memo}</p>
      <button onClick={handleBackToForm}>Back to Form</button>
      <button onClick={handleSendRequest}>Send Request</button>
    </div>
  );
}
