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

    // Initial Use effect
    useEffect(() => {
        if (userId !== 0) {
            getClientCurrentAppointment();
            getInterpreterCurrentAppointment();
        }
    }, [userId]);

    // JSX ELEMENTS
    return (
        <div className='dashboard__card'>
                <h1>Welcome, {userFirstName} {userLastName}!</h1>
                <div className='dashboard__card__role-switch'>
                    <button onClick={() => setCurrentTab('Client')} className='dashboard__card__role-switch__button'>Client</button>

                    <button onClick={() => setCurrentTab('Interpreter')} className='dashboard__card__role-switch__button'>Interpreter</button>
                </div>
                {currentTab === 'Client' && (
                    <div className='dashboard__card__role-content'>
                        <div className='dashboard__card__role-content__button-row'>
                            <Link href="/add-request">
                                <button className="dashboard__card__role-content__button-row__button">Add Request</button>
                            </Link>
                            <Link href={{
                                pathname: "/check-history",
                                query: {slug: "client"}
                            }}>
                                <button className="dashboard__card__role-content__button-row__button">History</button>
                            </Link>
                        </div>
                        <div className='dashboard__card__role-content__appointment-list'>
                            {clientCurrentAppointment?.map((appointment, index) => {
                                // Process date
                                const tempDateTime = appointment.appointmentDateTime;
                                const convertedDateTime = tempDateTime ? format(new Date(tempDateTime), "EEE',' dd MMM yy") : null;

                                return (
                                    <div key={index} className='dashboard__card__role-content__appointment-list__element'>
                                        <div>{appointment.id}</div>
                                        <div>{appointment.status}</div>
                                        <div>{appointment.appointmentTitle}</div>
                                        <div>{convertedDateTime}</div>
                                        <div>{appointment.appointmentType}</div>
                                        <div>{appointment.clientSpokenLanguage}</div>
                                        <div>{appointment.interpreterSpokenLanguage}</div>
                                        <div>{appointment.locationLatitude}</div>
                                        <div>{appointment.locationLongitude}</div>
                                        <Link href={{
                                            pathname: '/appointment-detail',
                                            query: {slug: appointment.id}
                                        }}>
                                            <button className="dashboard__card__role-content__appointment-list__element__button">Detail</button>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {currentTab === 'Interpreter' && (
                    <div className='dashboard__card__role-content'>
                        <div className='dashboard__card__role-content__button-row'>
                            <Link href="/find-request">
                                <button className="dashboard__card__role-content__button-row__button">Find Request</button>
                            </Link>
                            <Link href={{
                                pathname: "/check-history",
                                query: {slug: "interpreter"}
                            }}>
                                <button className="dashboard__card__role-content__button-row__button">History</button>
                            </Link>
                            <div className='dashboard__card__role-content__appointment-list'>
                            {interpreterCurrentAppointment?.map((appointment, index) => {
                                // Process date
                                const tempDateTime = appointment.appointmentDateTime;
                                const convertedDateTime = tempDateTime ? format(new Date(tempDateTime), "EEE',' dd MMM yy") : null;

                                return (
                                    <div key={index} className='dashboard__card__role-content__appointment-list__element'>
                                        <div>{appointment.id}</div>
                                        <div>{appointment.status}</div>
                                        <div>{appointment.appointmentTitle}</div>
                                        <div>{convertedDateTime}</div>
                                        <div>{appointment.appointmentType}</div>
                                        <div>{appointment.clientSpokenLanguage}</div>
                                        <div>{appointment.interpreterSpokenLanguage}</div>
                                        <div>{appointment.locationLatitude}</div>
                                        <div>{appointment.locationLongitude}</div>
                                        <Link href={{
                                            pathname: '/appointment-detail',
                                            query: {slug: appointment.id}
                                        }}>
                                            <button className="dashboard__card__role-content__appointment-list__element__button">Detail</button>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                        </div>
                        <div className='dashboard__card__role-content__appointment-list'>
                        </div>
                    </div>
                )}
        </div>
    )
}