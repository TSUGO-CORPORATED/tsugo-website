'use client';

// MODULES IMPORT
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MapComponent from "../../map-component/map"
import { Paper, Typography, Box, TextField, FormControl,SelectChangeEvent, InputLabel, Select, MenuItem, FormControlLabel, RadioGroup, Radio, Checkbox, Button } from '@mui/material';
import { colorOffDark, colorOffLight, colorOffMid, buttonOffDark, buttonOffLight, buttonOffMid, buttonBlack, buttonWhite } from '@/muistyle';
import dayjs, { Dayjs } from "dayjs";
// IMPORT FROM MUI
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { AlertColor } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


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
    appointmentDateTime: Date| undefined;
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
  "Communication": [
    "Phone", "Video", "Online Meetings", "Webinars", "Others"],
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

// COMPONENT FUNCTION
export default function UpdateAppointmentCard() {
  // STATE VARIABLES
  const [appointmentTitle, setAppointmentTitle] = useState<string>("");
  const [dateTime, setDateTime] = useState(dayjs());
  const [appointmentDateTime, setAppointmentDateTime] = useState(dayjs());
  const [clientSpokenLanguage, setClientSpokenLanguage] = useState<string>("");
  const [interpreterSpokenLanguage, setInterpreterSpokenLanguage] =
    useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("");
  const [appointmentNote, setAppointmentNote] = useState<
    string | number | readonly string[] | undefined>("");
  const [locationName, setLocationName] = useState<string>("");
  const [locationAddress, setLocationAddress] = useState<string | null>("");
  const [locationCoordinates, setLocationCoordinates] = useState<Coordinates | null>();
  const [locationLatitude, setLocationLatitude] = useState<string | number | null>();
  const [locationLongitude, setLocationLongitude] = useState< string | number | null>();
  const [error, setError] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("Business");
  const [loading, setLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState( mainCategories["Business"][0]);

 

  useEffect(() => {
    setLocationName("");
  }, [appointmentType]);

  const apiKey = "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM";
  const isMobile = useMediaQuery("(max-width:600px)");
  const router = useRouter();

  // SEARCH PARAMS
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  // HELPER FUNCTION
  // Get appointment detail information
  async function getAppointmentDetail(): Promise<void> {
    const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/detail/${appointmentId}`;
    const retrievedData = await axios.get(url);
    const data = retrievedData.data;
    console.log("detail", data);

    const processedDateTime = data.appointmentDateTime.substring(0, 16);
    // appointmentTitle: appointmentTitle,
    setAppointmentTitle(data.appointmentTitle);
    // appointmentTitle: selectedMainCategory + "-" + selectedSubCategory,
    setSelectedMainCategory(data.mainCategory);
    setSelectedSubCategory(data.subCategory) ;
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
    setLoading(false);
  }, []);

  // Update appointment information
  async function updateAppointment(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    const data = {
      appointmentId:appointmentId,
      appointmentTitle: appointmentTitle,
      appointmentType: appointmentType,
      mainCategory: selectedMainCategory,
      subCategory: selectedSubCategory,
      clientSpokenLanguage: clientSpokenLanguage,
      interpreterSpokenLanguage: interpreterSpokenLanguage,
      appointmentDateTime: appointmentDateTime,
      locationName: locationName,
      locationAddress: locationAddress,
      locationLatitude: locationCoordinates?.lat,
      locationLongitude: locationCoordinates?.lng,
      appointmentNote: appointmentNote,
    };
    console.log("update", data);
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

  //handler Func for Category change
  const handleMainCategoryChange = (event: SelectChangeEvent) => {
    const category = event.target.value as string;
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

  useEffect(() => {
    const appointmentDate = dayjs(appointmentDateTime);
    if (appointmentDate.isAfter(dayjs())) {
      setDateTime(appointmentDate);
    } else {
      setDateTime(dayjs());
    }
  }, [appointmentDateTime]);


if (loading) {
  return <CircularProgress />; 
}
 // JSX ELEMENTS
  return (
    <Box >
      <Paper className="update-appointment_container"
        elevation={12}
        sx={{
          padding: { xs: 1, md: 5 },
          maxWidth: { xs: "99%", md: "1200px" },
          minWidth:{ md: "900px"},
          width: { xs: "99%",md:"80%"} ,
          marginBottom: "15px",
          borderRadius: { xs: "0px", md: "16px" },
          justifyContent: "center",
          margin:"auto",
          marginTop: { xs: '100px', md: "10%" },
          boxShadow: { xs: "0px 0px 0px 0px rgba(0, 0, 0, 0)", md: "0px 4px 8px 0px rgba(0.5, 0.5, 0.5, 0.5)" },
        }}
      >
      <Box sx={{width: { xs: "100%", md: "80%" } }}>
        <Typography
          variant="h3"
          sx={{ textAlign: "center", mb: 2, fontWeight: "bold", fontSize: { xs: '1rem', md: '1.5rem' } }}
        >
          Update Appointment
        </Typography>
        <Box 
          
          component="form"
          onSubmit={updateAppointment}
          sx={{ display: "flex", flexDirection: "column", gap: 2,width: "100%"  }}
        >
          <TextField
            label="Title"
            required
            fullWidth
            value={appointmentTitle}
            onChange={(e) => setAppointmentTitle(e.target.value)}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Main Category</InputLabel>
            <Select
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
              required
              fullWidth
              label="Main Category"
            >
              {Object.keys(mainCategories).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              required
              fullWidth
              label="Sub Category"
            >
            {mainCategories[selectedMainCategory] && mainCategories[selectedMainCategory].map((subCategory) => (
                <MenuItem key={subCategory} value={subCategory}>
                  {subCategory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Memo"
            multiline
            rows={4}
            fullWidth
            value={appointmentNote}
          
            onChange={(e) => setAppointmentNote(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Desired Language</InputLabel>
            <Select
              value={clientSpokenLanguage}
              onChange={(e) => setClientSpokenLanguage(e.target.value)}
              required
              fullWidth
            >
              {languages.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Communication Language</InputLabel>
            <Select
              value={interpreterSpokenLanguage}
              onChange={(e) => setInterpreterSpokenLanguage(e.target.value)}
              required
              fullWidth
            >
              {languages.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {isMobile ? (
              <MobileDateTimePicker
                value={dateTime}
                onChange={(newDateTime) => {
                  if (newDateTime !== null) {
                    setDateTime(newDateTime);
                  }
                }}
                label="Date and Time"
                minDate={dayjs()}
              />
            ) : (
              <DesktopDateTimePicker
                value={dateTime}
                onChange={(newDateTime) => {
                  if (newDateTime !== null) {
                    setDateTime(newDateTime);
                  }
                }}
                label="Date and Time"
                minDate={dayjs()}
              />
            )}
          </LocalizationProvider>

          <FormControlLabel
            control={
              <Radio
                checked={appointmentType === "videoChat"}
                onChange={() => setAppointmentType("videoChat")}
              />
            }
            label="Video Chat Interpretation"
          />
          <FormControlLabel
            control={
              <Radio
                checked={appointmentType === "inPerson"}
                onChange={() => setAppointmentType("inPerson")}
              />
            }
            label="In-person Interpretation"
          />
          {appointmentType !== "videoChat" && (
            <Box sx={{
              margin: "-10px",
              boxShadow: { xs: "0px 0px 0px 0px rgba(0, 0, 0, 0)", md: "0px 4px 8px 0px rgba(0.3, 0.3, 0.3, 0.5)" },
            }}>
              <TextField sx={{ marginTop: "20px", width: { xs: "96%", md: "98%" }, marginLeft: "10px", marginRight: "10px" }}
                label="Location"
                required
                fullWidth
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
              <Button sx={{ buttonOffDark, marginTop: { xs: '15px', md: "20px" },  }}
                onClick={handleLocationSearch}>Confirm Location
                </Button>
              {locationCoordinates && (
                <Box sx={{ marginTop: 2, position: "relative" }}>
                <Box sx={{ width: "100%", margin: "auto" }}>
                <MapComponent coordinates={locationCoordinates}
                  style={{ marginLeft: "10px", marginRight: "10px", width: "98%", height: "400px" }} />
              </Box>
                                <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      backgroundColor: "white",
                    }}
                  >
                    {locationAddress}
                  </Typography> </Box>
              )}

            </Box>

          )}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
          >
            <Button type="submit"
              variant="contained"
              sx={buttonBlack}>Confirm</Button>
            <Link href="/dashboard">
              <Button
                variant="outlined"
                sx={buttonWhite}>Cancel update</Button>
            </Link>
          </Box>
        </Box>
        </Box>
      </Paper>
    </Box>
  );
}