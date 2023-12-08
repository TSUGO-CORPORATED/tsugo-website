"use client";
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { ContextVariables } from "../../context-variables";
import AppointmentBlock from '../global/appointment-block';
import MapComponent from "../map-component/map"
import {
  useMediaQuery, Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem,
  TextField, RadioGroup, FormControlLabel,useTheme,
  Radio, Checkbox, Button, Modal
} from '@mui/material';

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
  locationAdress: string;
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
  const [currentPosition, setCurrentPosition] = useState({});
  const [selectedInterpreterLanguage, setSelectedInterpreterLanguage] =
    useState("");
  const [selectedClientLanguage, setSelectedClientLanguage] = useState("");
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

  const isMobile = useMediaQuery("(max-width:600px)");
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
  const now = new Date();

  // console.log("NOW", now)
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentTime = new Date(appointment.appointmentDateTime);
    // console.log("appointmentTime",appointmentTime)
    const now = new Date();
    const timeFilter = appointmentTime > now;

    // const timeFilter =  new Date(appointment.appointmentDateTime) > new Date();
    const typeFilter =
      selectedType === "all" || appointment.appointmentType === selectedType;
    const keywordFilter =
      appointment.appointmentTitle
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.clientSpokenLanguage
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.interpreterSpokenLanguage
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.locationName
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.locationAdress
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.appointmentCategory
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase());
    const languageFilter =
      (selectedInterpreterLanguage === "" ||
        appointment.interpreterSpokenLanguage ===
          selectedInterpreterLanguage) &&
      (selectedClientLanguage === "" ||
        appointment.clientSpokenLanguage === selectedClientLanguage);

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
  // console.log("findTSX", mapCoordinates);

  const popUpAppointments = appointments.filter((appointment) => {
    const appointmentTime = new Date(appointment.appointmentDateTime);
    const now = new Date();
    const timeFilter = appointmentTime > now;
    const typeFilter = appointment.appointmentType === "inPerson";

    return typeFilter;
    // return timeFilter && typeFilter;
  });
  // console.log("popupAppo", popUpAppointments);

  return (
    <Paper
    sx={{
      marginTop: { xs: "10%", md: "3%" },
      width: { xs: "100%", md: "90%" },
      maxWidth: "1200px",
      minWidth: { xs: "350px", md: "800px" },
      borderRadius: "10px",
      marginBottom:"10px",
      overflow: "auto",
      padding: { xs: 0, md: 0 },
      boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)", 
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
        alignItems: "flex-start"
      }}
    >
      <Box
        sx={{
          width: { xs:"100%", md: "50%" },
          padding: { xs: 1, md:4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box component="h1" sx={{ textAlign: "center", mb: 2, fontSize: { xs: '1rem', md: '1.5rem' } }}>
          Check Appointments
        </Box>
          <Box sx={{ width: "100%", height: "400px" }}>
            <MapComponent
              appointments={popUpAppointments}
              style={{ width: "100%", height: "400px" }}
            />
          </Box>
          {/* <Box sx={{ mt: 2, width: "100%", marginTop: "40px" }}>
            <TextField
              fullWidth
              placeholder="Search appointments..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </Box> */}
          <RadioGroup
  row={!isMobile}
  value={selectedType}
  onChange={(e) => setSelectedType(e.target.value)}
  sx={{ 
    display: 'flex', 
    marginTop: { xs: "40px", md: "50px" },
  
    justifyContent: { xs: 'flex-start', md: 'space-around' }, 
  }}
>
  <FormControlLabel value="all" control={<Radio />} label="All" />
  <FormControlLabel value="videoChat" control={<Radio />} label="Video Chat" />
  <FormControlLabel value="inPerson" control={<Radio />} label="In-person" />
</RadioGroup>
          <Box sx={{ mt: 2, width: "100%", marginBottom: "20px" }}>
            <Select
              fullWidth
              displayEmpty
              value={selectedInterpreterLanguage}
              onChange={(e) => setSelectedInterpreterLanguage(e.target.value)}
            >
              <MenuItem value="" disabled>
                Select Interpreter Language
              </MenuItem>
              {languages.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
  
        
        <Box
          sx={{
            width: { md: "50%" },
            // height: "800px",
            minWidth: "300px",
            // overflowY: "auto", 
            marginTop:"30px",
            padding: 1
          }}
        >
          <Box sx={{ 
            marginTop:"30px",
            padding: 1
          }}>
          <AppointmentBlock 
          appointment={filteredAppointments} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
  
}
