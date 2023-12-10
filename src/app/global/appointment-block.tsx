'use client'

// MODULES IMPORT
import format from 'date-fns/format';
import { buttonBlack, buttonOffDark } from '@/muistyle';
import React, {useContext, useState, useEffect} from 'react';
import AppointmentDetail from './appointment-detail';
import dayjs, { Dayjs } from "dayjs";

// IMPORT FROM MUI
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PlaceIcon from '@mui/icons-material/Place';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import Divider from '@mui/material/Divider';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// INTERFACE 
interface AppointmentOverview {
    id: number;
    status: string;
    appointmentTitle: string,
    appointmentType: string,
    mainCategory: string | null,
    subCategory: string | null,
    clientSpokenLanguage: string;
    interpreterSpokenLanguage: string;
    locationName: string | null;
    locationLatitude: number | null;
    locationLongitude: number | null;
    appointmentDateTime: Date;
}

export default function AppointmentBlock({appointment, refresh}: {appointment: AppointmentOverview[], refresh?: Function}) {    
    // STATE VARIABLES 
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
    const [loadModal, setLoadModal] = useState<boolean>(false);
    const [selectedAppointment, setSelectedAppointment] = useState<number>(0);

    // HELPER FUNCTION
    // Controlling detail modal
    function handleOpenDetailModal() {
        setOpenDetailModal(true);
        setLoadModal(true);
    }

    function handleCloseDetailModal() {
        setOpenDetailModal(false);
        setLoadModal(false);
    }

    function assignSelectedAppointment (e: any): void {
        const tempSelectedAppointment = Number(e.target.dataset.appointmentid);
        console.log(tempSelectedAppointment);
        setSelectedAppointment(tempSelectedAppointment);
        handleOpenDetailModal()
    }

    return (
        <>
            <AppointmentDetail appointmentId={selectedAppointment} openDetailModal={openDetailModal} closeDetailModal={handleCloseDetailModal} refresh={refresh} load={loadModal}/>
            {appointment?.map((appointment, index) => {
                // Process date
                const tempDateTime = appointment.appointmentDateTime;
                // console.log(tempDateTime)
                const dateObject = new Date(tempDateTime)
                const convertedDate = tempDateTime ? dayjs(tempDateTime).format("MM/DD/YYYY ") : null;
                const convertedTime = tempDateTime ? dayjs(tempDateTime).format("HH:mm") : null;
                // const convertedDateTime = tempDateTime ? format(dateObject, "MM/dd/yy HH:mm") : null;

                // Process status
                let statusClass: string | undefined;
                switch (appointment.status) {
                    case 'Requested':
                        statusClass = 'appointment-block__grid__status__text-requested';
                        break;
                    case 'Accepted':
                        statusClass = 'appointment-block__grid__status__text-accepted';
                        break;
                    case 'Completed':
                        statusClass = 'appointment-block__grid__status__text-completed';
                        break;
                    case 'Cancelled':
                        statusClass = 'appointment-block__grid__status__text-cancelled';
                        break;
                }

                // Process location name
                const locationName = appointment.locationName ? appointment.locationName : '-';
                const words = locationName.split(" ");

                for (let i = 0; i < words.length; i++) {
                    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
                }

                const processLocationName = words.join(" ");

                return (
                    <Paper elevation={3} key={index} className='appointment-block'>
                        <Grid container rowSpacing={{ xs: 1, md: 3 }} columnSpacing={{ xs: 2, md: 3 }} className='appointment-block__grid'>
                            <Grid xs={5}>
                                {appointment.appointmentType === 'In-Person' ? (
                                    <div className='appointment-block__grid__logo'>
                                        <AccessibilityIcon />
                                        <p className='appointment-block__grid__logo__text'>In-Person</p>
                                    </div>
                                ) : (
                                    <div className='appointment-block__grid__logo'>
                                        <VideoCallIcon />
                                        <p className='appointment-block__grid__logo__text'>Video Call</p>
                                    </div>
                                )}
                            </Grid>
                            <Grid xs={3}>
                                <div className='appointment-block__grid__date-time'>
                                    <p className='appointment-block__grid__date-time__date'>{convertedDate}</p>
                                    <p className='appointment-block__grid__date-time__time'>{convertedTime}</p>
                                </div>
                            </Grid>
                            <Grid xs={4}>
                                <div className='appointment-block__grid__status'>
                                    <div className={'appointment-block__grid__status__text ' + statusClass}>{appointment.status}</div>
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <Divider />
                            </Grid>
                            <Grid xs={12}>
                                <div className='appointment-block__grid__piece'>
                                    <label className='appointment-block__grid__piece__label'>Title</label>
                                    <p className='appointment-block__grid__piece__data'>{appointment.appointmentTitle}</p>
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className='appointment-block__grid__piece'>
                                    <label className='appointment-block__grid__piece__label'>Category</label>
                                    <p className='appointment-block__grid__piece__data'>{appointment.mainCategory ? appointment.mainCategory + " - " + appointment.subCategory : '-'}</p>
                                </div>
                                {/* <Divider /> */}
                            </Grid>
                            <Grid xs={12}>
                                <div className='appointment-block__grid__location'>
                                    <div className='appointment-block__grid__location__icon'><PlaceIcon/></div>
                                    <p className='appointment-block__grid__location__text'>{processLocationName}</p>
                                </div>
                            </Grid>
                            <Grid xs={12} className='appointment-block__grid__last-line'>
                                <div className='appointment-block__grid__last-line__language'>
                                    <div className='appointment-block__grid__last-line__language__icon'><GTranslateIcon/></div>
                                    <p className='appointment-block__grid__last-line__language__text'>{appointment.clientSpokenLanguage + " - " + appointment.interpreterSpokenLanguage}</p>
                                </div>
                                <Button onClick={assignSelectedAppointment} variant='contained' sx={{...buttonOffDark, padding: '5px 10px', paddingRight: '0'}} className='appointment-block__grid__last-line__button' data-appointmentid={appointment.id}>
                                    <p className='appointment-block__grid__last-line__button__text' data-appointmentid={appointment.id}>Details</p>
                                    <KeyboardArrowRightIcon className='appointment-block__grid__last-line__button__icon' data-appointmentid={appointment.id}/>
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                )
            })}
        </>
    );
}