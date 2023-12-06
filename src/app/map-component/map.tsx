import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript,InfoWindow, Marker, LoadScriptNext} from "@react-google-maps/api";
// import { computeDistanceBetween } from 'google.maps.geometry.spherical';
import Link from 'next/link';
import { Button } from '@mui/material';

type Coordinate = {
  lat: number;
  lng: number;
};

type Appointments = {
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
    locationAdress : string;
  };

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

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number  {
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

function deg2rad(deg: number): number{
  return deg * (Math.PI / 180);
}



 
const MapComponent: React.FC<Props> = ({ coordinates, appointments , style}) => {
    
    const isCoordinatesArray = Array.isArray(coordinates);
    const isAppointmentsArray= Array.isArray(appointments)
  //replace this to .ENV
    const apiKey = "AIzaSyDTDbQpsF1sCz8luY6QQO7i1WuLPEI-_jM"

    console.log("map appointment",appointments)
   

    const zoomLevel = isAppointmentsArray ? 10 : 15;
    const [selectedAppointment, setSelectedAppointment] = useState<Appointments | null>(null);
    const [lastSelectedMarker, setLastSelectedMarker] = useState<Appointments  | null>(null);
    const handleMarkerClick = (appointment: Appointments) => {
        setSelectedAppointment(appointment);
    };
    
    const [currentPosition, setCurrentPosition] = useState<Coordinate>(() => {
      if (coordinates) {
        return isCoordinatesArray ? coordinates[0] : coordinates;
      }
      return { lat: 36.895, lng: 139.6917 };
    });

    const initialCenter = { lat: 36.6895, lng: 139.6917 };
    const [mapCenter, setMapCenter] = useState<Coordinate>(initialCenter);
    console.log("mapCenter",mapCenter)

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
        console.log("currentP", startLat,startLng)
        console.log("Closest Marker:", closestMarker.locationLatitude, closestMarker.locationLongitude);
        setLastSelectedMarker(closestMarker);
        setMapCenter({ lat: Number(closestMarker.locationLatitude), lng: Number(closestMarker.locationLongitude) });
      } else {
        console.log("No more markers found");
      }
    };


    
    // const markers = appointments ? appointments.map(appointment => (
    //     <Marker 
    //       key={appointment.id}
    //       position={{ lat: Number(appointment.locationLatitude), lng: Number(appointment.locationLongitude) }}
    //       onClick={() => handleMarkerClick(appointment)}
    //     >
    //       {selectedAppointment && selectedAppointment.id === appointment.id && (
    //         <InfoWindow onCloseClick={() => setSelectedAppointment(null)}>
    //           <div>
    //             <h3>{appointment.appointmentTitle}</h3>
    //             <p>{appointment.locationName}</p>
    //             <p>{appointment.locationAdress}</p>
    //             <p>{appointment.clientSpokenLanguage}⇔{appointment.interpreterSpokenLanguage}</p>
    //             <Link href={{
    //                         pathname: '/appointment-detail',
    //                         query: {appointmentId: appointment.id}
    //                     }} className="appointment-block__detail">
    //                         &gt;
    //                     </Link>
    //           </div>
    //         </InfoWindow>
    //       )}
      //   </Marker>
      // )) : isCoordinatesArray ? coordinates.map((coord, index) => (
      //   <Marker key={index} position={{ lat: coord.lat, lng: coord.lng }} />
      // )) : <Marker position={mapCenter} />;
      const infoWindowStyle = {
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '4px',
        color:"black",
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
      };
      
      function formatDateTime(dateStr:any) {
        const date = new Date(dateStr);
        const year = date.getFullYear().toString().substr(-2);
        const month = date.toLocaleString('en-US', { month: 'short' }); 
        const day = date.getDate(); 
        const hours = date.getHours().toString().padStart(2, '0'); 
        const minutes = date.getMinutes().toString().padStart(2, '0'); 
      
        return `${month} ${day}, ${year} ${hours}:${minutes}`;
      }


  const markers = appointments ? appointments.map(appointment => (
    <Marker
      key={appointment.id}
      position={{ lat: Number(appointment.locationLatitude), lng: Number(appointment.locationLongitude) }}
      onClick={() => handleMarkerClick(appointment)}
    >
      {selectedAppointment && selectedAppointment.id === appointment.id && (
        <InfoWindow onCloseClick={() => setSelectedAppointment(null)}>
          <div style={infoWindowStyle}>
            <h3 style={{ margin: 0 }}>{appointment.appointmentTitle}</h3>
            <p>At:{appointment.locationName}</p>
            <p>{appointment.locationAdress}</p>
            <p>{formatDateTime(appointment.appointmentDateTime)}</p>
            <p>{appointment.clientSpokenLanguage}⇔{appointment.interpreterSpokenLanguage}</p>
            <div style={{ textAlign: 'center', width: "80%", }}>
              <div style={{ textAlign: 'center', margin: 'auto', maxWidth: '100%' }}>
                <Link href={{
                  pathname: '/appointment-detail',
                  query: { appointmentId: appointment.id }
                }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: 'black',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'grey',
                      },
                    }}
                  >
                    To Detail
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </Marker>
  )) : isCoordinatesArray ? coordinates.map((coord, index) => (
    <Marker key={index} position={{ lat: coord.lat, lng: coord.lng }} />
  )) : <Marker position={mapCenter} />;



      useEffect(() => {
        if (coordinates) {

          setCurrentPosition(isCoordinatesArray ? coordinates[0] : coordinates);
          setMapCenter(isCoordinatesArray ? coordinates[0] : coordinates)
        }
      }, [coordinates, appointments, isCoordinatesArray]);
      
      // useEffect(() => {
      //   if (appointments && appointments.length > 0 && "geolocation" in navigator) {
      //     navigator.geolocation.getCurrentPosition(
      //       (position) => {
      //         setMapCenter({
      //           lat: position.coords.latitude,
      //           lng: position.coords.longitude,
      //         });
      //       },
      //       (err) => {
      //         console.error(err);
      //         setMapCenter(initialCenter);
      //       }
      //     );
      //   }
      // }, [appointments]);
  
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
      }, [appointments]);


    return (
      <div style={style}>
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
      {/* {appointments && appointments.length > 0 && (
          <button onClick={moveToClosestMarker}>Move to the Nearest</button>
        )} */}
      </div>
    );
  };
  
  export default MapComponent;
 
// const mapRef = useRef(null);
// const YOUR_BING_MAPS_API_KEY = "AiNzDpY3NAhheYg6ki_c1XODOJIpHW654zRFilGaUxmxn5z32VZICRAonbXUupsL"
// useEffect(() => {
//   const loadBingMap = () => {
//     const map = new window.Microsoft.Maps.Map(mapRef.current, {
//       center: new window.Microsoft.Maps.Location(coordinates.lat, coordinates.lng),
//       mapTypeId: window.Microsoft.Maps.MapTypeId.road,
//       zoom: 15
//     });

//     new window.Microsoft.Maps.Pushpin(map.getCenter(), null);
//   };

//   if (!window.Microsoft) {
//     const script = document.createElement("script");
//     script.type = "text/javascript";
//     script.async = true;
//     script.defer = true;
//     script.src = `https://www.bing.com/api/maps/mapcontrol?key=${YOUR_BING_MAPS_API_KEY}&callback=loadBingMap`;
//     document.body.appendChild(script);
//     window.loadBingMap = loadBingMap;
//   } else {
//     loadBingMap();
//   }
// }, [coordinates]);

// return <div ref={mapRef} style={{ width: "300px", height: "300px" }}></div>;
// };


// export default MapComponent;
