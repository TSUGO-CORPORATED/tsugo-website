"use client";

// IMPORT MODULES
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { ContextVariables } from "../../context-variables";
import AppointmentBlock from '../global/appointment-block';
import MapComponent from "../map-component/map";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// IMPORT FROM MUI
import {
  useMediaQuery, Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem,
  TextField, RadioGroup, FormControlLabel,useTheme,
  Radio, Checkbox, Button, Modal
} from '@mui/material';

// TYPE INTERFACE
type Appointment = {
  // id: number;
  // status: string;
  // appointmentTitle: string,
  // appointmentType: string,
  // clientSpokenLanguage: string;
  // interpreterSpokenLanguage: string;
  // locationName: string;
  // locationLatitude: number;
  // locationLongitude: number;
  // appointmentDateTime: Date;
  // locationAdress: string;
  // appointmentCategory: string;
  id: number;
  status: string;
  appointmentTitle: string,
  appointmentType: string,
  mainCategory: string | null,
  subCategory: string | null,
  clientSpokenLanguage: string;
  interpreterSpokenLanguage: string;
  locationName: string | null;
  locationLatitude: number;
  locationLongitude: number;
  appointmentDateTime: Date;
};

type Coordinate = {
  lat: number;
  lng: number;
};

export default function FindRequestCard() {
  // USE STATE VARIABLES
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedType, setSelectedType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPosition, setCurrentPosition] = useState({});
  const [popUpAppointments, setPopUpAppointments] = useState<Appointment[]>([]);
  const [selectedInterpreterLanguage, setSelectedInterpreterLanguage] = useState<string>("");
  // const [selectedClientLanguage, setSelectedClientLanguage] = useState("");

  const languages = [
    "All",
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
  // console.log(userId);

  // FETCH APPOINTMENT DATA
  async function fetchAppointments() {
    try {
      const response = await axios.get(
        `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/find/${userId}`
      );
      // console.log(response)
      setAppointments(response.data);
      // console.log("lists", response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  useEffect(() => {
    if (userId !== 0) fetchAppointments();
  }, [userId]);

  // APPLY FILTER TO APPOINTMENT LIST 
  // const now = new Date();
  // console.log("NOW", now)
  function applyFilter(appointments: Appointment[]) {
    const result = appointments.filter((appointment) => {
      // const appointmentTime = new Date(appointment.appointmentDateTime);
      // console.log("appointmentTime",appointmentTime)
      // const now = new Date();
      // const timeFilter = appointmentTime > now;
      // const timeFilter =  new Date(appointment.appointmentDateTime) > new Date();
  
      const typeFilter = selectedType === "all" || appointment.appointmentType === selectedType;
      // console.log(typeFilter);
  
      const keywordFilter =
        String(appointment.id)
          ?.includes(searchKeyword.toLowerCase()) ||
        appointment.appointmentTitle
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase()) ||
        appointment.appointmentType
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
        //   .includes(searchKeyword.toLowerCase()) ||
        // appointment.locationAdress
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase()) ||
        appointment.mainCategory
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase()) ||
        appointment.subCategory
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase());
      // console.log(keywordFilter);
  
  
      const languageFilter = selectedInterpreterLanguage === "" || selectedInterpreterLanguage === "All" || appointment.interpreterSpokenLanguage === selectedInterpreterLanguage;
        // (selectedInterpreterLanguage === "" || appointment.interpreterSpokenLanguage === selectedInterpreterLanguage) &&
        // (selectedClientLanguage === "" || appointment.clientSpokenLanguage === selectedClientLanguage);
      // console.log(languageFilter)
  
      return typeFilter && keywordFilter && languageFilter;
      // return true
    });
    setFilteredAppointments(result);
  }
  useEffect(() => {
    applyFilter(appointments);
  }, [selectedType, selectedInterpreterLanguage, searchKeyword]);
  useEffect(() => {
    applyFilter(appointments);
    // console.log(appointments)
  }, [appointments]);
  // useEffect(() => {
  //   console.log(filteredAppointments);
  // }, [filteredAppointments]);


  // const mapSize = {
  //   width: "100%",
  //   height: "400px",
  // };

  // GEOLOCATION
  // Set Current position. Note that if vpn is used, current position will be off
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
          console.error("Failed to get your Geolocation .");
        }
      );
    }
  }, []);
  // useEffect(() => {
  //   console.log(currentPosition)
  // }, [currentPosition])

  function getPopUpAppointments(filteredAppointments: Appointment[]) {
    const tempPopUpAppointments = filteredAppointments.filter((appointment) => {
      const typeFilter = appointment.appointmentType === "In-Person";
      return typeFilter;
    });
    // console.log("popupAppo", tempPopUpAppointments);
    setPopUpAppointments(tempPopUpAppointments);
  }

  useEffect(() => {
    getPopUpAppointments(filteredAppointments);
  },[filteredAppointments])


  // const popUpAppointments = appointments.filter((appointment) => {
  //   const appointmentTime = new Date(appointment.appointmentDateTime);
  //   const now = new Date();
  //   const timeFilter = appointmentTime > now;
  //   const typeFilter = appointment.appointmentType === "In-person";

  //   return typeFilter;
  // });
  // console.log("popupAppo", popUpAppointments);

  // const mapCoordinates = appointments
  //   .map((appointment) => {
  //     if (
  //       appointment.locationLatitude != null &&
  //       appointment.locationLongitude != null
  //     ) {
  //       return {
  //         lat: Number(appointment.locationLatitude),
  //         lng: Number(appointment.locationLongitude),
  //       };
  //     }
  //     return null;
  //   })
  //   .filter((coord) => coord !== null) as Coordinate[];
  // console.log("findTSX", mapCoordinates);

  // JSX ELEMENTS
  return (
    <Paper
      // sx={{
        // marginTop: { xs: "10%", md: "3%" },
        // width: { xs: "100%", md: "90%" },
        // maxWidth: "1200px",
        // minWidth: { xs: "350px", md: "800px" },
        // borderRadius: "10px",
        // marginBottom:"10px",
        // overflow: "auto",
        // padding: { xs: 0, md: 0 },
        // boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)", 
      // }}
      elevation={5}
      className='find-request__block'
    >
      <Link href="/dashboard" className='find-request__back-button'>
        <ArrowBackIcon className='find-request__back-button__icon'/>
      </Link>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          // overflow: "hidden",
          alignItems: "flex-start",
          height: "100%",
        }}
        // className='find-request__block'
      >

        <Box
          sx={{
            width: { xs:"100%", md: "50%" },
            height: '100%',
            padding: { xs: 1, md:4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >

          <Box component="h1" sx={{ textAlign: "center", mb: 2, fontSize: { xs: '1.5rem', md: '1.5rem' } }}>
            Check Appointments
          </Box>
          <Box 
            // sx={{ width: "100%", height: "400px" }} 
            className="find-request__map"
          >
            <MapComponent
              appointments={popUpAppointments}
              style={{ 
                width: "100%", 
                height: "100%",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}    
            />
          </Box>
          <RadioGroup
            row={!isMobile}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            sx={{ 
              display: 'flex', 
              marginTop: { xs: "10px", md: "10px" },
              flexDirection: 'row',
              // justifyContent: { xs: 'flex-start', md: 'space-around' }, 
            }}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="Video Chat" control={<Radio />} label="Video Chat" />
            <FormControlLabel value="In-Person" control={<Radio />} label="In-person" />
          </RadioGroup>
          <Box 
            sx={{ 
              // mt: 2, 
              width: "100%", 
              marginTop: "10px" 
            }}
          >
            <TextField
              fullWidth
              placeholder="Search appointments..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              inputProps={{
                style: {
                  height: "10px",
                },
              }}
            />
          </Box>
          <Box 
            sx={{ 
              // mt: 2, 
              width: "100%", 
              marginTop: "10px" 
            }}
          >
            <Select
              fullWidth
              displayEmpty
              value={selectedInterpreterLanguage}
              onChange={(e) => setSelectedInterpreterLanguage(e.target.value)}
              className='find-request__select-language'
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
            height: "100%",
            minWidth: "300px",
            overflowY: "auto", 
            // marginTop:"30px",
            padding: 1
          }}
        >
          { filteredAppointments.length !==0 ? 
            (<AppointmentBlock appointment={filteredAppointments} />) 
          : (
            <div className='find-request__appointment'>No Appointment Available</div>
          )}
          {/* <AppointmentBlock appointment={filteredAppointments} /> */}
        </Box>
      </Box>
    </Paper>
  );
  
}
