'use client';

// MODULES IMPORT
import { useState, useContext, useEffect } from 'react';
import { ContextVariables } from '../../context-variables';
import Link from 'next/link';
import axios from 'axios';
import format from 'date-fns/format';

// PAGE COMPONENT
export default function DashboardCard(): JSX.Element {
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


    // STATE VARIABLES
    const [currentTab, setCurrentTab] = useState<string>('Client');
    const [clientCurrentAppointment, setClientCurrentAppointment] = useState<AppointmentOverview[]>([]);
    const [interpreterCurrentAppointment, setInterpreterCurrentAppointment] = useState<AppointmentOverview[]>([]);
    
    // CONTEXT VARIABLES
    const { userId, userFirstName, userLastName } = useContext(ContextVariables);
    console.log(userId, userFirstName, userLastName);

    // HELPER FUNCTION
    // Get client current appointment
    async function getClientCurrentAppointment(): Promise<void> {
        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/overview/client/current/${userId}`;
        const retrievedData = await axios.get(url);
        console.log(retrievedData);
        setClientCurrentAppointment(retrievedData.data);
    }
    // Get interpreter current appointment
    async function getInterpreterCurrentAppointment(): Promise<void> {
        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/overview/interpreter/current/${userId}`;
        const retrievedData = await axios.get(url);
        console.log(retrievedData);
        setInterpreterCurrentAppointment(retrievedData.data);
    }

    // INITIAL USE EFFECT
    useEffect(() => {
        if (userId !== 0) {
            getClientCurrentAppointment();
            getInterpreterCurrentAppointment();
        }
    }, [userId]);

    // CONDITIONAL TAB
    const shownAppointmentBlock = currentTab === 'Client' ? clientCurrentAppointment : interpreterCurrentAppointment;
    
    // JSX ELEMENTS
    return (
        <div className='dashboard__card'>
                {/* <h1>Welcome, {userFirstName} {userLastName}!</h1> */}
                <div className='dashboard__card__role-switch'>
                    <div onClick={() => setCurrentTab('Client')} className={currentTab === 'Client' ? 'dashboard__card__role-switch__button dashboard__card__role-switch__button__selected' : 'dashboard__card__role-switch__button'}>Client</div>
                    <div onClick={() => setCurrentTab('Interpreter')} className={currentTab === 'Interpreter' ? 'dashboard__card__role-switch__button dashboard__card__role-switch__button__selected' : 'dashboard__card__role-switch__button'}>Interpreter</div>
                </div>
                <div className='dashboard__card__separator'></div>
                <div className='dashboard__card__role-content'>
                    <div className='dashboard__card__role-content__button-row'>
                        {currentTab === 'Client' ? (
                            <>
                                <Link href="/add-request" className="dashboard__card__role-content__button-row__button-request">
                                    <div>Add Request</div>
                                </Link>
                                <Link href={{
                                    pathname: "/check-history",
                                    query: {slug: "client"},
                                }} className="dashboard__card__role-content__button-row__button-history">
                                    <div>History</div>
                                </Link>
                            </>
                        ) : 
                        <>
                            <Link href="/find-request" className="dashboard__card__role-content__button-row__button-request">
                                <div>Find Request</div>
                            </Link>
                            <Link href={{
                                pathname: "/check-history",
                                query: {slug: "interpreter"}
                            }} className="dashboard__card__role-content__button-row__button-history">
                                <div>History</div>
                            </Link>
                        </>}
                    </div>
                    <div className='dashboard__card__role-content__list-title'>Current Appointment</div>
                    <div className='dashboard__card__role-content__appointment-list'>
                        {shownAppointmentBlock?.map((appointment, index) => {
                            // Process date
                            const tempDateTime = appointment.appointmentDateTime;
                            const convertedDateTime = tempDateTime ? format(new Date(tempDateTime), "EEE',' dd MMM yy") : null;

                            return (
                                <div key={index} className='dashboard__card__role-content__appointment-list__block'>
                                    <div className='dashboard__card__role-content__appointment-list__block__info'>
                                        <div className='dashboard__card__role-content__appointment-list__block__info__row'>
                                            <div className='dashboard__card__role-content__appointment-list__block__info__row__piece'>
                                                <label className='dashboard__card__role-content__appointment-list__block__info__row__piece__label'>ID:</label>
                                                <p className='dashboard__card__role-content__appointment-list__block__info__row__piece__data'>{appointment.id}</p>
                                            </div>
                                            <div className='dashboard__card__role-content__appointment-list__block__info__row__piece'>
                                                <label className='dashboard__card__role-content__appointment-list__block__info__row__piece__label'>Status:</label>
                                                <p className='dashboard__card__role-content__appointment-list__block__info__row__piece__data'>{appointment.status}</p>
                                            </div>
                                            <div className='dashboard__card__role-content__appointment-list__block__info__row__piece'>
                                                <label className='dashboard__card__role-content__appointment-list__block__info__row__piece__label'>Title:</label>
                                                <p className='dashboard__card__role-content__appointment-list__block__info__row__piece__data'>{appointment.appointmentTitle}</p>
                                            </div>
                                        </div>
                                        <div className='dashboard__card__role-content__appointment-list__block__info__row'>
                                            <div className='dashboard__card__role-content__appointment-list__block__info__row__piece'>
                                                <label className='dashboard__card__role-content__appointment-list__block__info__row__piece__label'>Time:</label>
                                                <p className='dashboard__card__role-content__appointment-list__block__info__row__piece__data'>{convertedDateTime}</p>
                                            </div>
                                            <div className='dashboard__card__role-content__appointment-list__block__info__row__piece'>
                                                <label className='dashboard__card__role-content__appointment-list__block__info__row__piece__label'>Type:</label>
                                                <p className='dashboard__card__role-content__appointment-list__block__info__row__piece__data'>{appointment.appointmentType}</p>
                                            </div>
                                            <div className='dashboard__card__role-content__appointment-list__block__info__row__piece'>
                                                <label className='dashboard__card__role-content__appointment-list__block__info__row__piece__label'>Location:</label>
                                                <p className='dashboard__card__role-content__appointment-list__block__info__row__piece__data'>{appointment.locationName}</p>
                                            </div>
                                        </div>
                                        <div className='dashboard__card__role-content__appointment-list__block__info__row'>
                                            <div className='dashboard__card__role-content__appointment-list__block__info__row__piece'>
                                                <label className='dashboard__card__role-content__appointment-list__block__info__row__piece__label'>Your Language:</label>
                                                <p className='dashboard__card__role-content__appointment-list__block__info__row__piece__data'>{appointment.clientSpokenLanguage}</p>
                                            </div>
                                            <div className='dashboard__card__role-content__appointment-list__block__info__row__piece'>
                                                <label className='dashboard__card__role-content__appointment-list__block__info__row__piece__label'>Interpreter Language:</label>
                                                <p className='dashboard__card__role-content__appointment-list__block__info__row__piece__data'>{appointment.interpreterSpokenLanguage}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className='dashboard__card__role-content__appointment-list__block__detail'> */}
                                        <Link href={{
                                            pathname: '/appointment-detail',
                                            query: {slug: appointment.id}
                                        }} className="dashboard__card__role-content__appointment-list__block__detail">
                                            &gt;
                                        </Link>
                                    {/* </div> */}
                                </div>
                            );
                        })}
                    </div>
                </div>
        </div>
    )
}