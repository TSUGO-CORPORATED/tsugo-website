'use client'

// MODULES IMPORT
import Link from 'next/link';
import format from 'date-fns/format';
import { buttonBlack } from '@/muistyle';
import React, {useContext, useState, useEffect} from 'react';
import AppointmentDetail from './appointment-detail';

// IMPORT FROM MUI
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// INTERFACE 
interface AppointmentOverview {
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
}

// MODAL
const detailWindowStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    borderRadius: 2,
    // boxShadow: 24,
    p: 4,
};

export default function AppointmentBlock({appointment}: {appointment: AppointmentOverview[]}) {    
    return (
        <>
            {appointment.length === 0 ? <div>No Ongoing Appointment</div> : null}
            {appointment?.map((appointment, index) => {
                // STATE VARIABLES 
                // const [openDetail, setOpenDetail] = useState(false);

                // // HELPER FUNCTION
                // function handleOpenDetail() {
                //     setOpenDetail(true);
                // }
                // function handleCloseDetail() {
                //     setOpenDetail(false);
                // }

                // Process date
                const tempDateTime = appointment.appointmentDateTime;
                // console.log(tempDateTime)
                const dateObject = new Date(tempDateTime)
                const convertedDateTime = tempDateTime ?format(dateObject, "EEE, dd MMM yy") : null;

                return (
                    <div key={index} className='appointment-block'>
                        <Paper elevation={2}>
                            <Grid container spacing={1}>
                                <Grid xs={6}>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>ID:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.id}</p>
                                    </div>
                                </Grid>
                                <Grid xs={6}>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Status:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.status}</p>
                                    </div>
                                </Grid>
                                <Grid xs={6}>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Date:</label>
                                        <p className='appointment-block__info__row__piece__data'>{convertedDateTime}</p>
                                    </div>
                                </Grid>
                                <Grid xs={6}>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Type:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.appointmentType}</p>
                                    </div>
                                </Grid>
                                <Grid xs={12}>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Title:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.appointmentTitle}</p>
                                    </div>
                                </Grid>
                                <Grid xs={12}>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Location:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.locationName ? appointment.locationName : '-' }</p>
                                    </div>
                                </Grid>
                                <Grid xs={12}>
                                    <div className="appointment-block__detail">


                                        <Link href={{
                                            pathname: '/appointment-detail',
                                            query: {appointmentId: appointment.id}
                                        }} className="appointment-block__detail__link">
                                            <Button variant='contained' sx={buttonBlack} size='small' className="appointment-block__detail__link__button">
                                                <div className="appointment-block__detail__link__button__text">
                                                    <p>See details</p>
                                                </div>
                                            </Button>
                                        </Link> 


                                        {/* <Button onClick={handleOpenDetail} variant='contained' sx={buttonBlack} size='small' className="appointment-block__detail__link__button">
                                            <div className="appointment-block__detail__link__button__text">
                                                <p>See details</p>
                                            </div>
                                        </Button>
                                        <Modal
                                            open={openDetail}
                                            onClose={handleCloseDetail}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                            // disableEnforceFocus
                                            sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.2)'} }}
                                        >
                                            <Box sx={detailWindowStyle} className='appointment-block__detail__window'>
                                                <AppointmentDetail appointmentId={appointment.id}/>
                                            </Box>
                                        </Modal> */}
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </div>
                )
            })}
        </>
    );
}