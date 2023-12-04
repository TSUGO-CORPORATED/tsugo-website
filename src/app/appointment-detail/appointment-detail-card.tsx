'use client';

// MODULES IMPORT
import { useState, useContext, useEffect } from 'react';
import { ContextVariables } from '../../context-variables';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import format from 'date-fns/format';
import Disclaimer from '../disclaimer';


// PAGE COMPONENT
export default function AppointmentDetailCard(): JSX.Element {
    // TYPESCRIPT DATA TYPES
    interface AppointmentDetail {
        id: number;
        appointmentTitle: string,
        appointmentType: string,
        clientSpokenLanguage: string;
        interpreterSpokenLanguage: string;
        locationName: string | null;
        locationAddress: string | null;
        locationLatitude: string | number | null,
        locationLongitude: string | number | null,
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
        reviewClientThumb: boolean | null,
        reviewClientNote: string | null,
        reviewInterpreterThumb: boolean | null,
        reviewInterpreterNote: string | null,
    } 

    type NewStatus = "Accepted" | "Cancelled" | "Completed";

    // SEARCH PARAMS
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');
    // console.log(appointmentId);

    // STATE VARIABLES
    const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail>();
    const [isAgreed, setIsAgreed] = useState(false);
    const [showModal, setShowModal] = useState(false);
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

    function FormattedDateTime(input:any) {
        const dateTime = new Date(input);
        return dateTime.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
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

    const handleOpenModal = () => {
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
      };
    
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
                                <p className="appointment_detail__label">Location Name:</p>{appointmentDetail?.locationName}
                            </div>
                            <div className='appointment_detail__location_name'>
                                <p className="appointment_detail__label">Location Address:</p>{appointmentDetail?.locationAddress}
                            </div>
                            <div className='appointment_detail__converted_date_time'>
                                <p className="appointment_detail__label">Date Time:</p>{FormattedDateTime(convertedDateTime)}
                            </div>
                            <div className='appointment_detail__note'>
                                <p className="appointment_detail__label">Note:</p>{appointmentDetail?.appointmentNote}
                            </div>
                        </div>
                        <div className='appointment_detail__content__element_4'>
                            <div className='appointment_detail__review_client_rating'>
                                <p>review client thumb</p>
                                <p>
                                    {appointmentDetail?.reviewClientThumb === true ? 'Yes' : null}
                                    {appointmentDetail?.reviewClientThumb === false ? 'No' : null}
                                </p>
                            </div>
                            <div className='appointment_detail__review_client_note'>
                                <p>review client note</p><p>{appointmentDetail?.reviewClientNote}</p>

                            </div>
                            <div className='appointment_detail__review_interpreter_rating'>
                                <p>review interpreter thumb</p>
                                <p>
                                    {appointmentDetail?.reviewInterpreterThumb === true ? 'Yes' : null}
                                    {appointmentDetail?.reviewInterpreterThumb === false ? 'No' : null}
                                </p>
                            </div>
                            <div className='appointment_detail__review_interpreter_note'>
                                <p>review interpreter note</p><p>{appointmentDetail?.reviewInterpreterNote}</p>
                            </div>
                        </div>
                    </div>
                    <div className='appointment_detail__button_box'>
                        <div className='appointment_detail__buttons'>
                            {/* change status button */}
                            {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId !== userId && (
                                <>            
                                <div className="appointment_detail_check_box">
                                <label className="appointment_detail_check_label">
                                  <input
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    required
                                    className="add_request_checkbox"
                                  />
                                    <span className="appointment_detail_agree">
                                       I agree to the <span onClick={handleOpenModal} className="appointment_detail_disclaimer-link">Disclaimer</span><br></br>
                                       Our site prohibits any financial transactions through its platform and<br></br>
                                      accepts no liability for any issues arising from interpretation services.
                                    </span>
                                </ label>
                              </div>
                              {showModal && (
                                <Disclaimer handleCloseModal={handleCloseModal} />
                                    )}
                                    <button onClick={() => handleStatusChange("Accepted")} className='accept_button'>Accept</button>
                                </>
                            )}
                            {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId === userId && (
                                <>
                                    <button onClick={() => handleStatusChange("Cancelled")} className='cancel_button'>Cancel</button>
                                    <Link href={{
                                        pathname: '/appointment-detail/update-appointment',  
                                        query: { appointmentId: appointmentDetail?.id }
                                    }}>
                                        <button className='chat_room_button'>Update appointment</button>
                                    </Link>
                                </>
                            )}
                            {appointmentDetail?.status === "Accepted" && appointmentDetail.clientUserId === userId && (
                                <>
                                    <button onClick={() => handleStatusChange("Cancelled")} className='cancel_button'>Cancel</button>
                                    <button onClick={() => handleStatusChange("Completed")} className='complete_button'>Complete</button>
                                </>
                            )}
                            {appointmentDetail?.status === "Accepted" && (
                                <>
                                    <Link href={{
                                        pathname: '/appointment-detail/chat-room',  
                                        query: { slug: appointmentDetail?.id }
                                    }}>
                                        <button className='chat_room_button'>Go to chat room</button>
                                    </Link>
                                    <Link href={{
                                        pathname: '/appointment-detail/update-appointment',  
                                        query: { appointmentId: appointmentDetail?.id }
                                    }}>
                                        <button className='chat_room_button'>Update appointment</button>
                                    </Link>
                                </>
                            )}
                            {appointmentDetail?.status === "Completed"
                                && ((userId === appointmentDetail.clientUserId && appointmentDetail.reviewClientThumb === null) || (userId === appointmentDetail.interpreterUserId && appointmentDetail.reviewInterpreterThumb === null))
                                && (
                                    <>
                                        <Link href={{
                                            pathname: '/appointment-detail/review',
                                            query: {
                                                appointmentId: appointmentDetail?.id,
                                                role: userId === appointmentDetail.clientUserId ? 'client' : 'interpreter',
                                            }
                                        }}>
                                            <button className='appointment_detail_add_review_button'>Add review</button>
                                        </Link>
                                    </>
                                
                            )} <button className='back_to _dashboard'  onClick={() => router.push("/dashboard")}>Go back to the list</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
                                }