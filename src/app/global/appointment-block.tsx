// MODULES IMPORT
import Link from 'next/link';
import format from 'date-fns/format';
import { buttonBlack } from '@/muistyle';

// IMPORT FROM MUI
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

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

export default function AppointmentBlock({appointment}: {appointment: AppointmentOverview[]}) {
    // function FormattedDateTime(input:any) {
    //     const dateTime = new Date(input);
    //     return dateTime.toLocaleString('en-US', {
    //       month: '2-digit',
    //       day: '2-digit',
    //       year: 'numeric',
    //       hour: '2-digit',
    //       minute: '2-digit',
    //       hour12: true
    //     });
    //   }

      
    return (
        <>
            {appointment?.map((appointment, index) => {
                // Process date
                const tempDateTime = appointment.appointmentDateTime;
                const convertedDateTime = tempDateTime ? format(new Date(tempDateTime), "EEE',' dd MMM yy") : null;

                return (
                    <div key={index} className='appointment-block'>
                        <Paper elevation={3}>
                            {/* <Box sx={{ flexGrow: 1 }}> */}
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
                                            <p className='appointment-block__info__row__piece__data'>{appointment.locationName}</p>
                                        </div>
                                    </Grid>
                                    <Grid xs={12}>
                                        <Link href={{
                                            pathname: '/appointment-detail',
                                            query: {appointmentId: appointment.id}
                                        }} className="appointment-block__detail-link">
                                            <Button variant='contained' sx={buttonBlack} size='small' className="appointment-block__detail-link__button">
                                                <div className="appointment-block__detail-link__button__text">
                                                    <p>See details</p>
                                                </div>
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            {/* </Box> */}
                            {/* <div className='appointment-block__info'>
                                <div className='appointment-block__info__row'>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>ID:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.id}</p>
                                    </div>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Status:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.status}</p>
                                    </div>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Title:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.appointmentTitle}</p>
                                    </div>
                                </div>
                                <div className='appointment-block__info__row'>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Time:</label>
                                        <p className='appointment-block__info__row__piece__data'>{convertedDateTime}</p>
                                    </div>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Type:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.appointmentType}</p>
                                    </div>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Location:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.locationName}</p>
                                    </div>
                                </div>
                                <div className='appointment-block__info__row'>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Your Language:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.clientSpokenLanguage}</p>
                                    </div>
                                    <div className='appointment-block__info__row__piece'>
                                        <label className='appointment-block__info__row__piece__label'>Interpreter Language:</label>
                                        <p className='appointment-block__info__row__piece__data'>{appointment.interpreterSpokenLanguage}</p>
                                    </div>
                                </div>
                            </div> */}
                            {/* <Link href={{
                                pathname: '/appointment-detail',
                                query: {appointmentId: appointment.id}
                            }} className="appointment-block__detail">
                                &gt;
                            </Link> */}
                        </Paper>
                    </div>
                )
            })}
        </>
    );
}