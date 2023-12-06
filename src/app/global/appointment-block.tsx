// MODULES IMPORT
import Link from 'next/link';
import format from 'date-fns/format';
import { buttonBlack } from '@/muistyle';

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
    clientSpokenLanguage: string;
    interpreterSpokenLanguage: string;
    locationName: string;
    locationLatitude: number;
    locationLongitude: number;
    appointmentDateTime: Date;
}

export default function AppointmentBlock({appointment}: {appointment: AppointmentOverview[]}) {     
    return (
        <>
            {appointment.length === 0 ? <div>No Ongoing Appointment</div> : null}
            {appointment?.map((appointment, index) => {
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