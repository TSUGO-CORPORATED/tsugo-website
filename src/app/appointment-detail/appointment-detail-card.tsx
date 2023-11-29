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
        locationName: string | null;
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
        <div className='appointment_detail_page'>
            <div className='appointment_detail__card'>
                <div className='appointment_detail__content'>
                    <div className='appointment_detail__content__element'>
                        <div className='appointment_detail__content__element_1'>
                            <div className='appointment_detail__id'>
                                <p className="appointment_detail__label">ID: </p>{appointmentDetail?.id}
                            </div>
                            <div className='appointment_detail__status'>
                                <p className="appointment_detail__label">Status:</p>{appointmentDetail?.status}
                            </div>
                            <div className='appointment_detail__title'>
                                <p className="appointment_detail__label">Title:</p>{appointmentDetail?.appointmentTitle}
                            </div>
                            <div className='appointment_detail__type'>
                                <p className="appointment_detail__label">Type:</p>{appointmentDetail?.appointmentType}
                            </div>
                        </div>
                        <div className='appointment_detail__content__element_2'>
                            <div className='appointment_detail__client_firstname'>
                                <p className="appointment_detail__label">Client Firstname:</p>{appointmentDetail?.clientUser.firstName}
                            </div>
                            <div className='appointment_detail__client_lastname'>
                                <p className="appointment_detail__label">Client Lastname:</p>{appointmentDetail?.clientUser.lastName}
                            </div>
                            <div className='appointment_detail__client_profile_picture'>
                                <p className="appointment_detail__label"></p>{appointmentDetail?.clientUser.profilePicture}
                            </div>
                            <div className='appointment_detail__client_spoken_language'>
                                <p className="appointment_detail__label">Spoken language:</p>{appointmentDetail?.clientSpokenLanguage}
                            </div>
                            <div className='appointment_detail__interpreter_firstname'>
                                <p className="appointment_detail__label">Interpreter Firstname:</p>{appointmentDetail?.interpreterUser?.firstName}
                            </div>
                            <div className='appointment_detail__interpreter_lastname'>
                                <p className="appointment_detail__label">Interpreter Lastname:</p>{appointmentDetail?.interpreterUser?.lastName}
                            </div>
                            <div className='appointment_detail__interpreter_profile_picture'>
                                {appointmentDetail?.interpreterUser?.profilePicture}
                            </div>
                            <div className='appointment_detail__interpreter_spoken_language'>
                                <p className="appointment_detail__label">Interpreter Spoken language:</p>{appointmentDetail?.interpreterSpokenLanguage}
                            </div>
                        </div>
                        <div className='appointment_detail__content__element_3'>
                            <div className='appointment_detail__location_name'>
                                <p className="appointment_detail__label">Location:</p>{appointmentDetail?.locationName}
                            </div>
                            <div className='appointment_detail__converted_date_time'>
                                <p className="appointment_detail__label">Date Time:</p>{convertedDateTime}
                            </div>
                            <div className='appointment_detail__note'>
                                <p className="appointment_detail__label">Note</p>{appointmentDetail?.appointmentNote}
                            </div>
                        </div>
                        <div className='appointment_detail__content__element_4'>
                            <div className='appointment_detail__review_client_rating'>
                                {appointmentDetail?.reviewClientRating}
                            </div>
                            <div className='appointment_detail__review_client_note'>
                                {appointmentDetail?.reviewClientNote}
                            </div>
                            <div className='appointment_detail__review_interpreter_rating'>
                                {appointmentDetail?.reviewInterpreterRating}
                            </div>
                            <div className='appointment_detail__review_interpreter_note'>
                                {appointmentDetail?.reviewInterpreterNote}
                            </div>
                        </div>
                    </div>
                    <div className='appointment_detail__button_box'>
                        <div className='appointment_detail__buttons'>
      {/* change status button */}
      {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId !== userId && (
                            <>
                                <button onClick={() => handleStatusChange("Accepted")} className='accept_button'>Accept</button>
                            </>
                        )}
                        {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId === userId && (
                            <>
                                <button onClick={() => handleStatusChange("Cancelled")} className='cancel_button'>Cancel</button>
                            </>
                        )}
                        {appointmentDetail?.status === "Accepted" && appointmentDetail.clientUserId === userId && (
                            <>
                                <button onClick={() => handleStatusChange("Cancelled")} className='cancel_button'>Cancel</button>
                                <button onClick={() => handleStatusChange("Completed")} className='complete_button'>Complete</button>
                            </>
                        )}
                        {appointmentDetail?.status === "Accepted" && (
                            <Link href={{
                                pathname: '/appointment-detail/chat_room',
                                query: { slug: appointmentDetail?.id }
                            }}>
                                <button className='chat_room_button'>Go to chat room</button>
                            </Link>
                        )}
                        {appointmentDetail?.status === "Complete"
                            && ((userId === appointmentDetail.clientUserId && appointmentDetail.reviewClientRating === null) || (userId === appointmentDetail.interpreterUserId && appointmentDetail.reviewInterpreterRating === null))
                            && (
                                <>
                                    <Link href={{
                                        pathname: '/appointment-detail/review',
                                        query: {
                                            appointmentId: appointmentDetail?.id,
                                            role: userId === appointmentDetail.clientUserId ? 'client' : 'interpreter',
                                        }
                                    }}>
                                        <button className='add_review_button'>Add review</button>
                                    </Link>
                                </>
                            )}
                    </div>
                    </div>
                </div>
            </div>
            </div>
        )
                                }