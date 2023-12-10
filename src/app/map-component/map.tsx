
// MODULES IMPORT
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, InfoWindow, Marker, LoadScriptNext } from "@react-google-maps/api";
import Link from 'next/link';
import AppointmentDetail from '../global/appointment-detail';

// IMPORT FROM MUI
import { buttonBlack, buttonOffDark } from '@/muistyle';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import format from 'date-fns/format';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


// INTERFACE 
type Coordinate = {
  lat: number;
  lng: number;
};

type Appointments = {
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

interface AppointmentDetail {
  id: number;
  appointmentTitle: string,
  appointmentType: string,
  mainCategory: string | null,
  subCategory: string | null,
  clientSpokenLanguage: string;
  interpreterSpokenLanguage: string;
  locationName: string | null;
  locationAddress: string | null;
  locationLatitude: string | number | null,
  locationLongitude: string | number | null,
  appointmentDateTime: Date;
  appointmentNote: string | null;
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


type Props = {
  coordinates?: Coordinate | Coordinate[];
  appointments?: Appointments[];
  style?: React.CSSProperties;
};

interface MapComponentProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  style?: React.CSSProperties;
}

//Helper function for nearest location caculation
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}


const MapComponent: React.FC<Props> = ({ coordinates, appointments, style }) => {

  const isCoordinatesArray = Array.isArray(coordinates);
  const isAppointmentsArray = Array.isArray(appointments)
  //replace this to .ENV
  const apiKey = "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM"
  const zoomLevel = isAppointmentsArray ? 14 : 15;
  // console.log("map appointment", appointments)


 //useState Variables
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [loadModal, setLoadModal] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointments | null>(null);
  const [lastSelectedMarker, setLastSelectedMarker] = useState<Appointments | null>(null);
  const handleMarkerClick = (appointment: Appointments) => {setSelectedAppointment(appointment); };
  const [currentPosition, setCurrentPosition] = useState<Coordinate>(() => {
    if (coordinates) {
      return isCoordinatesArray ? coordinates[0] : coordinates;
    }
    return { lat: 36.895, lng: 139.6917 };
  });
  const initialCenter = { lat: 36.6895, lng: 139.6917 };
  const [mapCenter, setMapCenter] = useState<Coordinate>(initialCenter);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0)
 
  // console.log("mapCenter", mapCenter)

  const moveToClosestMarker = () => {
    if (!appointments || appointments.length === 0) return;

    let closestMarker = appointments[0];
    let minDistance = Infinity;
    let startLat = lastSelectedMarker ? lastSelectedMarker.locationLatitude : currentPosition.lat;
    let startLng = lastSelectedMarker ? lastSelectedMarker.locationLongitude : currentPosition.lng;

    appointments.forEach(appointment => {
      if (!lastSelectedMarker || lastSelectedMarker.id !== appointment.id) {
        const distance = haversine(
          startLat, startLng,
          Number(appointment.locationLatitude), Number(appointment.locationLongitude)
        );
        if (distance < minDistance) {
          closestMarker = appointment;
          minDistance = distance;
        }
      }
    });

    if (closestMarker && closestMarker.locationLatitude !== undefined && closestMarker.locationLongitude !== undefined) {
      console.log("currentP", startLat, startLng)
      console.log("Closest Marker:", closestMarker.locationLatitude, closestMarker.locationLongitude);
      setLastSelectedMarker(closestMarker);
      setMapCenter({ lat: Number(closestMarker.locationLatitude), lng: Number(closestMarker.locationLongitude) });
    } else {
      console.log("No more markers found");
    }
  };

  const moveToNextLocation = () => {
    if (appointments && appointments.length > 0) {
      const nextIndex = (currentIndex + 1) % appointments.length;
      setCurrentIndex(nextIndex);
  
      const nextAppointment = appointments[nextIndex];
      setMapCenter({ 
        lat: Number(nextAppointment.locationLatitude), 
        lng: Number(nextAppointment.locationLongitude) 
      });
    }
  };
  




  function handleOpenDetailModal() {
    setOpenDetailModal(true);
    setLoadModal(true);
}
function handleCloseDetailModal() {
    setOpenDetailModal(false);
}

const infoWindowStyle = {
    backgroundColor: 'white',
    overflow:"hidden"
     };

 

  const markers = appointments ? appointments.map(appointment => (
    
    <Marker
      key={appointment.id}
      position={{ lat: Number(appointment.locationLatitude), lng: Number(appointment.locationLongitude) }}
      onClick={() => handleMarkerClick(appointment)}
    >
      {selectedAppointment && selectedAppointment.id === appointment.id && (
        <InfoWindow onCloseClick={() => setSelectedAppointment(null)}>
          <div style={infoWindowStyle}>
          <Grid container spacing={1} className='map-block__grid'>
                            <Grid xs={6}>
                                <div className='map-block__grid__piece'>
                                    <label className='map-block__grid__piece__label' style={{ fontWeight: 'bold', color: 'black' }}>ID:</label>
                                    <p className='map-block__grid__piece__data'>{appointment.id}</p>
                                </div>
                            </Grid>
                            <Grid xs={6}>
                                <div className='map-block__grid__piece'>
                                    <label className='map-block__grid__piece__label' style={{ fontWeight: 'bold', color: 'black' }}>Status:</label>
                                    <p className='map-block__grid__piece__data'>{appointment.status}</p>
                                </div>
                            </Grid>
                            <Grid xs={6}>
                                <div className='map-block__grid__piece'>
                                    <label className='map-block__grid__piece__label'  style={{ fontWeight: 'bold', color: 'black' }}>Date:</label>
                                    <p className='map-block__grid__piece__data'>{appointment.appointmentDateTime? format(new Date( appointment.appointmentDateTime), "dd MMM yy"): null}</p>
                                </div>
                            </Grid>
                            <Grid xs={6}>
                                <div className='map-block__grid__piece'>
                                    <label className='map-block__grid__piece__label'  style={{ fontWeight: 'bold', color: 'black' }}>Type:</label>
                                    <p className='map-block__grid__piece__data'>{appointment.appointmentType}</p>
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className='map-block__grid__piece'>
                                    <label className='map-block__grid__piece__label'  style={{ fontWeight: 'bold', color: 'black' }}>Title:</label>
                                    <p className='map-block__grid__piece__data'>{appointment.appointmentTitle}</p>
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className='map-block__grid__piece'>
                                    <label className='map-block__grid__piece__label'  style={{ fontWeight: 'bold', color: 'black' }}>Location:</label>
                                    <p className='map-block__grid__piece__data'>{appointment.locationName ? appointment.locationName : '-' }</p>
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className="map-block__detail">
                                    <Button onClick={handleOpenDetailModal} variant='contained' sx={buttonOffDark} size='small' className="map-block__detail__button">
                                        <div className="map-block__detail__button__text">See details</div>
                                    </Button>
                                    <AppointmentDetail appointmentId={appointment.id} openDetailModal={openDetailModal} closeDetailModal={handleCloseDetailModal} load={loadModal}/>
                                </div>
                            </Grid>
                        </Grid>
          </div>
        </InfoWindow>
      )}
    </Marker>
  )) : isCoordinatesArray ? coordinates.map((coord, index) => (
    <Marker key={index} position={{ lat: coord.lat, lng: coord.lng }} />
  )) : <Marker position={mapCenter} />;


//useEffect *from AddRequest / FindRequest
  useEffect(() => {
    if (coordinates) {
      setCurrentPosition(isCoordinatesArray ? coordinates[0] : coordinates);
      setMapCenter(isCoordinatesArray ? coordinates[0] : coordinates)
      setLoading(false);
    }
  }, [coordinates, appointments, isCoordinatesArray]);

  useEffect(() => {
    if (appointments && appointments.length > 0 && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error(err);

          setMapCenter(initialCenter);
        }
      );
    }
    setLoading(false);
  }, [appointments]);
 
 
  if (loading) {
    return <CircularProgress />; 
  }
  //JSX Elements
  return (
    <div 
      style={style}
    >
      <LoadScriptNext googleMapsApiKey={apiKey}>

        <GoogleMap
          mapContainerStyle={style || { width: '300px', height: '300px' }}
          center={mapCenter}
          zoom={zoomLevel}
        >
          {markers}
          {/* {isCoordinatesArray
            ? coordinates.map((coord, index) => (
                <Marker key={index} position={{ lat: coord.lat, lng: coord.lng }} />
              ))
            : <Marker position={mapCenter} />
          }  */}
        </GoogleMap>
      </LoadScriptNext>
      {appointments && appointments.length > 0 && (
        <div >
          <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Button  variant="contained"
          color="primary"
          onClick={moveToClosestMarker}
          sx={buttonOffDark}>Nearest Request</Button>

          <Button
          variant="contained"
          color="primary"
          onClick={moveToNextLocation}
          sx={buttonOffDark}
        >
          Next Location
        </Button>
        </Box>
        </div>
        )}
    </div>
  );
};

export default MapComponent;
