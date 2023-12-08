'use client';
import React, { useState, useContext,useEffect } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker,useLoadScript } from "@react-google-maps/api";
import { useRouter } from 'next/navigation';
import { ContextVariables } from "../../context-variables";
import MapComponent from "../map-component/map"
import Disclaimer from '../disclaimer';
import {Paper,TextFieldProps , Modal ,Snackbar,  Alert, TextField,SelectChangeEvent, Button,Radio, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel,Typography,Box, RadioGroup, Link as MuiLink } from '@mui/material';
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { useMediaQuery } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
// import { DesktopDateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { AlertColor } from '@mui/material';
import { colorOffDark, colorOffLight, colorOffMid, buttonOffDark, buttonOffLight, buttonOffMid, buttonBlack, buttonWhite } from '@/muistyle';


type Coordinates = { lat: number; lng: number; } | null;
type StatusFilter = "Requesting" | "Accepted" | "Cancelled" | "Completed" | "";
type MainCategoriesType = {
  [key: string]: string[];
};

export default function CreateAppointment () {


  const router = useRouter();
  const { userId } = useContext(ContextVariables);
  const isMobile = useMediaQuery("(max-width:600px)");
  //State settings
  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs());
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
  const [showModal, setShowModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [formErrors, setFormErrors] = useState({appointmentTitle: "", location: "", isAgreed: "" });
  //use Effect on appointment change => clears the location input
  useEffect(() => {
    setLocation("");
  }, [appointmentType]);

  //   //this is my apikey for temporary but its not working !!
  const apiKey = "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM";


  //helper Func combining 2 location search func
  const handleError = (errorMessage: string) => {
    setAlertMessage(errorMessage);
    setAlertSeverity("error");
    setOpenSnackbar(true);
  };

  const handleLocationSearch = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=${apiKey}`
      );

      if (response.data.results.length === 0) {
        let errorMessage = "No results found for the given location.";
        handleError(errorMessage);
        throw new Error("No results found for the given location.");
      }

      const { lat, lng } = response.data.results[0].geometry.location;
      setLocationCoordinates({ lat, lng });

      const addressResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );

      if (addressResponse.data.results.length === 0) {
        let errorMessage = "No address found for the given coordinates.";
        handleError(errorMessage);
        throw new Error("No address found for the given coordinates.");
      }

      const fetchedAddress = addressResponse.data.results[0].formatted_address;
      setAddress(fetchedAddress);
      setError("");
    } catch (error) {
      console.error("Error in location search: ", error);
      setError("An unknown error occurred.");
    }
  };



  //select box lists
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
    Business: [
      "Company Visits",
      "Product Descriptions",
      "Market Research",
      "Training Sessions",
      "Internal Presentations",
      "Others",
    ],
    Educational: [
      "School Education",
      "Universities and Colleges",
      "Academic Lectures",
      "Research Meetings",
      "Educational Programs",
      "Career Counseling",
      "Parent-Teacher Meetings",
      "Others",
    ],
    Tourism: [
      "Tourist Guidance",
      "Travel Assistance",
      "Guided Tours",
      "Cultural Heritage",
      "Eco-Tourism",
      "Adventure Sports",
      "Shopping and Ordering in Tourism",
      "Others",
    ],
    Communication: ["Phone", "Video", "Online Meetings", "Webinars", "Others"],
    "Culture and Arts": [
      "Art Exhibitions",
      "Museum Guiding",
      "Music Events",
      "Performing Arts",
      "Literature and Books",
      "Others",
    ],
    Technical: [
      "Engineering",
      "IT and Software",
      "Scientific Research",
      "Manufacturing",
      "Environmental Technology",
      "Others",
    ],
    Sports: [
      "Sports Events",
      "Athlete Support",
      "Interviews",
      "Sports Training",
      "Others",
    ],
    Entertainment: [
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
    Hospital: [
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
    Others: ["Others"],
  };

  
  //select box lists use State
  const [selectedMainCategory, setSelectedMainCategory] = useState("Business");
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    mainCategories["Business"][0]
  );

  //handler Func for Category change
  const handleMainCategoryChange = (event: SelectChangeEvent) => {
    const category = event.target.value as string;
    setSelectedMainCategory(category);
    setSelectedSubCategory(mainCategories[category][0]);
  };

  //Submit Func =>swithcing to Confirm
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormErrors({ appointmentTitle: "", location: "", isAgreed: "" });
    setError("");
    let hasErrors = false;

    // 
    if (!appointmentTitle) {
      setFormErrors(prev => ({ ...prev, appointmentTitle: "Please enter Title" }));
      hasErrors = true;
    }

    if (appointmentType === "inPerson" && !location) {
      setFormErrors(prev => ({ ...prev, location: "Please set Location" }));
      hasErrors = true;
    }

    if (!isAgreed) {
      setFormErrors(prev => ({ ...prev, isAgreed: "Please agree to the Terms and Conditions" }));
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }
    setIsConfirmed(true);
  };

  //handler Func to send to Server
  const handleSendRequest = async () => {
    try {
      let convertedDateTime = "";
      if (dateTime) {
        convertedDateTime = dateTime.toISOString();
      }

      const requestData = {
        appointmentTitle: appointmentTitle,
        // appointmentTitle: selectedMainCategory + "-" + selectedSubCategory,
        appointmentType: appointmentType,
        // appointmentCategory: selectedMainCategory + "-" + selectedSubCategory,
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
      // alert("Request sent successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error sending request: ", error);
      setError("Error sending request.");
    }
  };


  //HTML
  return (
    <div className="add_request_container">
      <Paper
        elevation={12}
        sx={{
          padding: { xs: 1, md: 5 },
          maxWidth: "99%",
          margin: { xs: "5px", md: "20px" },
          marginBottom: "15px",
          borderRadius: { xs: "0px", md: "16px" },
          justifyContent: "center",
          marginTop: { xs: '100px', md: "10%" },
          boxShadow: { xs:"0px 0px 0px 0px rgba(0, 0, 0, 0)" , md:"0px 4px 8px 0px rgba(0.5, 0.5, 0.5, 0.5)"  },
        }}
      >
        <Typography variant="h3" sx={{ textAlign: "center", mb: 2, fontWeight: "bold", fontSize: { xs: '1rem', md: '1.5rem' } }}>
          Make an Appointment
        </Typography>
        <Box
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Title"
            required
            fullWidth
            onChange={(e) => setAppointmentTitle(e.target.value)}
            error={!!formErrors.appointmentTitle}
            helperText={formErrors.appointmentTitle}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Main Category</InputLabel>
            <Select
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
              required
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
              label="Sub Category"
            >
              {mainCategories[selectedMainCategory].map((subCategory) => (
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Please enter any additional information here..."
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Desired Language</InputLabel>
            <Select
              value={desireLanguage}
              onChange={(e) => setDesireLanguage(e.target.value)}
              required
              label="Desired Language"
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
              value={communicateLanguage}
              onChange={(e) => setCommunicateLanguage(e.target.value)}
              required
              label="Communication Language"
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
                onChange={(newDateTime) => setDateTime(newDateTime)}
                // components={{
                //   TextField: CustomTextField,
                // }}
                label="Date and Time"
                minDate = {dayjs()}
              />
            ) : (
              <DesktopDateTimePicker
                value={dateTime}
                onChange={(newDateTime) => setDateTime(newDateTime)}
                // components={{
                //   TextField: CustomTextField,
                // }}
                label="Date and Time"
                minDate = {dayjs()}
              />
            )}
          </LocalizationProvider>

          <FormControl component="fieldset">
            <RadioGroup row={!isMobile}>
              <FormControlLabel
                value="videoChat"
                control={<Radio />}
                label="Video Chat Interpretation"
                checked={appointmentType === "videoChat"}
                onChange={() => setAppointmentType("videoChat")}
                required
                className="add_request_radio"
              />
              <FormControlLabel
                value="inPerson"
                control={<Radio />}
                label="In-person Interpretation"
                checked={appointmentType === "inPerson"}
                onChange={() => setAppointmentType("inPerson")}
                required
              />
            </RadioGroup>
          </FormControl>

          {appointmentType !== "videoChat" && (
            <>
            <Box sx={{ margin:"-10px",
              boxShadow: { xs:"0px 0px 0px 0px rgba(0, 0, 0, 0)" , md:"0px 4px 8px 0px rgba(0.3, 0.3, 0.3, 0.5)"  },}}>
              <TextField sx={{marginTop:"20px",width:"98%", marginLeft:"10px",marginRight:"10px"}}
                label="Adress/Location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={!!formErrors.location}
                helperText={formErrors.location}
                placeholder="Enter Address or Location (e.g. Tokyo Station)"
               
                required
              />
              <Button sx={{buttonBlack,marginTop: { xs: '15px', md: "20px" },marginLeft:"10px"}}
                variant="outlined"
                onClick={handleLocationSearch}
                >
                Confirm Location
              </Button>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
              >
                <Alert
                  onClose={() => setOpenSnackbar(false)}
                  severity={alertSeverity}
                  sx={{ width: "100%" }}
                >
                  {alertMessage}
                </Alert>
              </Snackbar>
              {locationCoordinates && (
                <Box sx={{ marginTop: 2, position: "relative" }}>
                  <Box sx={{ width: "100%", margin: "auto" }}>
                    <MapComponent
                      coordinates={locationCoordinates}
                      style={{ marginLeft:"10px",marginRight:"10px",width: "98%", height: "400px" }}
                    />
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
                    {address}
                  </Typography>
                </Box>
              )}
              </Box>
            </>
          )}


          <Box sx={{ marginBottom: 2 }}>
            <FormControlLabel
              control={
                <Checkbox 
                // sx={{width:"5px",magrinLeft:"10px"}}
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  required
                />
              }
              label={
                <Typography sx={{
                  color: "red",
                  fontWeight: "bold",
                  marginTop:"10pX",
                  magrinLeft:"10px",
                  fontSize: {
                    xs: '10px',
                    md: '15px'
                  }
                }}>
                  I agree to the Terms and Conditions.
                </Typography>
              }
            />
            {formErrors.isAgreed && (
              <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                {formErrors.isAgreed}
              </Typography>
            )}
            <Box
              sx={{
                maxHeight: "150px",
                overflowY: "auto",
                mt: 2,
                p: 2,
                border: "1px solid #ccc",
              }}
            >
              <Disclaimer />
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              sx={buttonBlack}
            >
              <div>Confirm</div>
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/dashboard")}
              sx={buttonWhite}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
      <Modal
        className="confirm_section_container"
        open={isConfirmed}
        onClose={() => setIsConfirmed(false)}
        aria-labelledby="appointment-confirmation-modal"
        aria-describedby="appointment-confirmation-description"
      >
        <Box
          sx={{
            bgcolor: "transparent",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            boxShadow: 24,
            overflowY: "auto",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              bgcolor: "background.paper",
              padding: 3,
              Maxwidth: "100%",
            }}
          >
            <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
              Appointment Confirmation
            </Typography>
            <Typography variant="body1">
              Titile:{" "}
              <strong>
                {appointmentTitle}
              </strong>
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="body1">
                Category:{" "}
                <strong>
                  {selectedMainCategory}-{selectedSubCategory}
                </strong>
              </Typography>
              <Typography variant="body1">
                Memo: <strong>{note}</strong>
              </Typography>
              <Typography variant="body1">
                Desired Language: <strong>{desireLanguage}</strong>
              </Typography>
              <Typography variant="body1">
                Communication Language: <strong>{communicateLanguage}</strong>
              </Typography>
              <Typography variant="body1">
                Interpretation Type: <strong>{appointmentType}</strong>
              </Typography>
              <Typography variant="body1">
                Date and Time:{" "}
                <strong>
                  {dateTime
                    ? dayjs(dateTime).format("YYYY-MM-DD HH:mm")
                    : "Not set"}
                </strong>
              </Typography>

              {appointmentType === "inPerson" && (
                <>
                  <Typography variant="body1">
                    Location: <strong>{location}</strong>
                  </Typography>
                  <Typography variant="body1">
                    Address: <strong>{address}</strong>
                  </Typography>
                </>
              )}


            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                onClick={handleSendRequest}
                variant="contained"
                sx={buttonBlack}
              >
                Send Request
              </Button>
              <Button
                onClick={() => setIsConfirmed(false)}
                variant="outlined"
                sx={buttonWhite}
              >
                Back to Form
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </div>
  );
};
