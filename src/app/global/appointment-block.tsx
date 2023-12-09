'use client'

// MODULES IMPORT
import format from 'date-fns/format';
import { buttonBlack } from '@/muistyle';
import React, {useContext, useState, useEffect} from 'react';
import AppointmentDetail from './appointment-detail';

// IMPORT FROM MUI
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';

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
                const convertedDateTime = tempDateTime ? format(dateObject, "dd MMM yy") : null;

                return (
                    <Paper elevation={2} key={index} className='appointment-block'>
                        <Grid container spacing={1} className='appointment-block__grid'>
                            <Grid xs={6}>
                                <div className='appointment-block__grid__piece'>
                                    <label className='appointment-block__grid__piece__label'>ID:</label>
                                    <p className='appointment-block__grid__piece__data'>{appointment.id}</p>
                                </div>
                            </Grid>
                            <Grid xs={6}>
                                <div className='appointment-block__grid__piece'>
                                    <label className='appointment-block__grid__piece__label'>Status:</label>
                                    <p className='appointment-block__grid__piece__data'>{appointment.status}</p>
                                </div>
                            </Grid>
                            <Grid xs={6}>
                                <div className='appointment-block__grid__piece'>
                                    <label className='appointment-block__grid__piece__label'>Date:</label>
                                    <p className='appointment-block__grid__piece__data'>{convertedDateTime}</p>
                                </div>
                            </Grid>
                            <Grid xs={6}>
                                <div className='appointment-block__grid__piece'>
                                    <label className='appointment-block__grid__piece__label'>Type:</label>
                                    <p className='appointment-block__grid__piece__data'>{appointment.appointmentType}</p>
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className='appointment-block__grid__piece'>
                                    <label className='appointment-block__grid__piece__label'>Title:</label>
                                    <p className='appointment-block__grid__piece__data'>{appointment.appointmentTitle}</p>
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className='appointment-block__grid__piece'>
                                    <label className='appointment-block__grid__piece__label'>Category:</label>
                                    <p className='appointment-block__grid__piece__data'>{appointment.mainCategory ? appointment.mainCategory + "-" + appointment.subCategory : '-'}</p>
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className='appointment-block__grid__piece'>
                                    <label className='appointment-block__grid__piece__label'>Location:</label>
                                    <p className='appointment-block__grid__piece__data'>{appointment.locationName ? appointment.locationName : '-' }</p>
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className="appointment-block__detail">
                                    <Button onClick={assignSelectedAppointment} variant='contained' sx={buttonBlack} size='small' className="appointment-block__detail__button" data-appointmentid={appointment.id}>
                                        <div className="appointment-block__detail__button__text" data-appointmentid={appointment.id}>See details</div>
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                )
            })}
        </>
    );
}