'use client';

// MODULES IMPORT
import { useState, useContext, useEffect } from 'react';
import { ContextVariables } from '../../context-variables';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import format from 'date-fns/format';

// PAGE COMPONENT
export default function AppointmentDetailCard(): JSX.Element {
    // TYPESCRIPT DATA TYPES
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
        clientUserId: number;
        clientUser: {
          firstName: string;
          lastName: string;
          profilePicture?: any;
        };
        interpreterUserId: number | null;
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

    type NewStatus = "Accepted" | "Cancelled" | "Completed";

    // SEARCH PARAMS
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('slug');
    // console.log(appointmentId);

    // STATE VARIABLES
    const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail>();

    const router = useRouter();

    // CONTEXT VARIABLES
    const { userId } = useContext(ContextVariables);

    // HELPER FUNCTION
    // Get appointment detail information
    async function getAppointmentDetail(): Promise<void> {
        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/detail/${appointmentId}`;
        const retrievedData = await axios.get(url);
        console.log(retrievedData);
        setAppointmentDetail(retrievedData.data);
    }

    async function handleStatusChange(newStatus: NewStatus) {
        try {
            // Updating appointment status in the backend server
            let url;
            switch (newStatus) {
                case "Accepted":
                url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/accept/${appointmentId}/${userId}`;
                break;
                case "Cancelled":
                url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/cancel/${appointmentId}`;
                break;
                case "Completed":
                url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/complete/${appointmentId}`;
                break;
                default:
                return;
            }
            await axios.patch(url);
            alert(`Appointment ${newStatus} successfully!`);

            // Redirect to homepage
            router.push('/dashboard');
            
        } catch (error) {
          console.error(`Error updating appointment status: `, error);
          alert("Failed to update appointment status.");
        }
    };

    async function test() {
        console.log(appointmentDetail);
    }
    
    //   const handleSubmitRating = async (appointmentId: number) => {
    //     try {
    //       const reviewData = reviews[appointmentId];
    //       if (!reviewData) {
    //         alert("Please provide a rating and a review note.");
    //         return;
    //       }
    //       const requestData = {
    //         reviewRating: reviewData.rating,
    //         reviewNote: reviewData.note,
    //       };
    //       await axios.patch(
    //         `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/review/${appointmentId}`,
    //         requestData
    //       );
    //       alert("Thank you for Rating!");
    //     } catch (error) {
    //       console.error("Error submitting rating:", error);
    //     }
    //   };

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
            <button onClick={test}>Test</button>
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
                <div>
                    <p>Buttons</p>
                    {/* change status button */}
                    {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId !== userId && (
                        <>
                            <button onClick={() => handleStatusChange("Accepted")}>Accept</button>
                        </>
                    )}
                    {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId === userId && (
                        <>
                            <button onClick={() => handleStatusChange("Cancelled")}>Cancel</button>
                        </>
                    )}
                    {appointmentDetail?.status === "Accepted" && appointmentDetail.clientUserId === userId && (
                        <>
                            <button onClick={() => handleStatusChange("Cancelled")}>Cancel</button>
                            <button onClick={() => handleStatusChange("Completed")}>Complete</button>

                        </>
                    )}
                    {appointmentDetail?.status === "Accepted" && (
                        <Link href={{
                            pathname: '/appointment-detail/chat-room',
                            query: {slug: appointmentDetail?.id}
                        }}>
                            <button>Go to chat room</button>
                        </Link>
                    )}
                    {appointmentDetail?.status === "Complete" 
                    && ((userId === appointmentDetail.clientUserId && appointmentDetail.reviewClientRating === null) || (userId === appointmentDetail.interpreterUserId && appointmentDetail.reviewInterpreterRating === null))
                    && (
                        <>
                            <Link href="/appointment-detail/review"><button>Add review</button></Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}