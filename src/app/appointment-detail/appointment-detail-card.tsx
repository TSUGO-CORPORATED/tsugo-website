'use client';

// MODULES IMPORT
import { useState, useContext, useEffect } from 'react';
import { ContextVariables } from '../../context-variables';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import format from 'date-fns/format';


// PAGE COMPONENT
export default function AppointmentDetailCard(): JSX.Element {
    // INTERFACE
    interface AppointmentDetail {
        id: number;
        appointmentTitle: string,
        appointmentType: string,
        clientSpokenLanguage: string;
        interpreterSpokenLanguage: string;
        locationLatitude: string | number | null,
        locationLongitude: string | number | null,
        locationDetail: string | null;
        appointmentDateTime: Date;
        appointmentNote: string | null;
        status: string;
        clientUser: {
          firstName: string;
          lastName: string;
          profilePicture?: any;
        };
        interpreterUser: {
          firstName: string;
          lastName: string;
          profilePicture?: any;
        } | null;
        reviewClientRating: number | null,
        reviewClientNote: string | null,
        reviewInterpreterRating: number | null,
        reviewInterpreterNote: string | null,
    } 

    // SEARCH PARAMS
    // Retrieving appoint id from search params
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('slug');
    // console.log(appointmentId);

    // STATE VARIABLES
    const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail>();

    // HELPER FUNCTION
    // Get appointment detail information
    async function getAppointmentDetail(): Promise<void> {
        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/detail/${appointmentId}`;
        const retrievedData = await axios.get(url);
        console.log(retrievedData);
        setAppointmentDetail(retrievedData.data);
    }

    // Initial Use effect
    useEffect(() => {
        getAppointmentDetail();
        
    }, []);

    // Process date
    const tempDateTime = appointmentDetail?.appointmentDateTime;
    const convertedDateTime = tempDateTime ? format(new Date(tempDateTime), "EEE',' dd MMM yy") : null;
    return (
        <div className='appointment-detail__card'>
            <Link href="/dashboard">
                <button>Go back to dashboard</button>
            </Link>
            <div className='dashboard__card__role-content__appointment-list'>
                <div className='dashboard__card__role-content__appointment-list__element'>
                    <div>{appointmentDetail?.id}</div>
                    <div>{appointmentDetail?.status}</div>
                    <div>{appointmentDetail?.appointmentTitle}</div>
                    <div>{appointmentDetail?.appointmentType}</div>
                    <div>{appointmentDetail?.clientUser.firstName}</div>
                    <div>{appointmentDetail?.clientUser.lastName}</div>
                    <div>{appointmentDetail?.clientUser.profilePicture}</div>
                    <div>{appointmentDetail?.clientSpokenLanguage}</div>
                    <div>{appointmentDetail?.interpreterUser?.firstName}</div>
                    <div>{appointmentDetail?.interpreterUser?.lastName}</div>
                    <div>{appointmentDetail?.interpreterUser?.profilePicture}</div>
                    <div>{appointmentDetail?.interpreterSpokenLanguage}</div>
                    <div>{appointmentDetail?.locationLatitude}</div>
                    <div>{appointmentDetail?.locationLongitude}</div>
                    <div>{appointmentDetail?.locationDetail}</div>
                    <div>{convertedDateTime}</div>
                    <div>{appointmentDetail?.appointmentNote}</div>
                    <div>{appointmentDetail?.reviewClientRating}</div>
                    <div>{appointmentDetail?.reviewClientNote}</div>
                    <div>{appointmentDetail?.reviewInterpreterRating}</div>
                    <div>{appointmentDetail?.reviewInterpreterNote}</div>
                </div>
            </div>
        </div>
    )
}