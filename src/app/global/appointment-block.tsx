import Link from 'next/link';
import format from 'date-fns/format';

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
            {appointment?.map((appointment, index) => {
                // Process date
                const tempDateTime = appointment.appointmentDateTime;
                const convertedDateTime = tempDateTime ? format(new Date(tempDateTime), "EEE',' dd MMM yy") : null;

                return (
                    <div key={index} className='appointment-block'>
                        <div className='appointment-block__info'>
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
                        </div>
                        <Link href={{
                            pathname: '/appointment-detail',
                            query: {slug: appointment.id}
                        }} className="appointment-block__detail">
                            &gt;
                        </Link>
                    </div>
                )
            })}
        </>
    );
}