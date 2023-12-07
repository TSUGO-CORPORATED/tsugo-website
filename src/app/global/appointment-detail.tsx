'use client';

// MODULES IMPORT
import { useState, useContext, useEffect } from 'react';
import { ContextVariables } from '../../context-variables';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import format from 'date-fns/format';
import Disclaimer from '../disclaimer';
import { colorOffDark, colorOffLight, colorOffMid, buttonOffDark, buttonOffLight, buttonOffMid, buttonBlack, buttonWhite, buttonRed } from '@/muistyle';

// MUI IMPORT
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

// PAGE COMPONENT
export default function AppointmentDetail({appointmentId, closeWindow}: {appointmentId: number, closeWindow: any}): JSX.Element {
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
        console.log(retrievedData.data);
        setAppointmentDetail(retrievedData.data);
    }

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
    const convertedDateTime = tempDateTime ? format(new Date(tempDateTime), "EEE',' dd MMM yy', 'hh':'mm") : null;
    
    return (
        <div className='appointment-detail'>
            <div className='appointment-detail__header'>
                <p className='appointment-detail__header__title'>Appointment Detail</p>              
                <Button onClick={closeWindow} sx={{color: 'black'}} variant='text' size='small' className="appointment-detail__header__link-button">
                    <CloseIcon />
                </Button>
            </div>
            <div className='appointment-detail__content'>
                <div className='appointment-detail__content__primary'>
                    <div className='appointment-detail__content__primary__info'>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>ID</label>
                            <p className="appointment-detail__content__data__content">{appointmentDetail?.id}</p>
                        </div>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>Status</label>
                            <p className="appointment-detail__content__data__content">{appointmentDetail?.status}</p>
                        </div>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>Type</label>
                            <p className="appointment-detail__content__data__content">{appointmentDetail?.appointmentType}</p>
                        </div>
                    </div>
                    <div className='appointment-detail__content__primary__buttons'>
                        {/* change status button */}
                        {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId !== userId && (
                            <>            
                                <div className="appointment-detail__content_check_box">
                                <label className="appointment-detail__content_check_label">
                                    <input
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    required
                                    className="add_request_checkbox"
                                    />
                                    <span className="appointment-detail__content_agree">
                                        I agree to the <span onClick={handleOpenModal} className="appointment-detail_disclaimer-link">Disclaimer</span><br></br>
                                        Our site prohibits any financial transactions through its platform and<br></br>
                                        accepts no liability for any issues arising from interpretation services.
                                    </span>
                                </ label>
                                </div>
                                {showModal && (
                                    <Disclaimer handleCloseModal={handleCloseModal} />
                                )}
                                <Button onClick={() => handleStatusChange("Accepted")} sx={buttonOffMid} variant='contained' size='small' className='appointment-detail__content__button'>
                                    Accept appointment
                                </Button>
                            </>
                        )}
                        {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId === userId && (
                            <>
                                <Link href={{
                                    pathname: '/appointment-detail/update-appointment',  
                                    query: { appointmentId: appointmentDetail?.id }
                                }}>
                                    {/* <button className='chat_room_button'>Update appointment</button> */}
                                    <Button sx={buttonWhite} variant='contained' size='small' className='appointment-detail__content__button'>
                                        Update Appointment
                                    </Button>
                                </Link>
                                <Button onClick={() => handleStatusChange("Cancelled")} sx={buttonRed} variant='contained' size='small' className='appointment-detail__content__button'>
                                    Cancel appointment
                                </Button>
                            </>
                        )}
                        {appointmentDetail?.status === "Accepted" && (
                            <>
                                {appointmentDetail.clientUserId === userId && (
                                    <>
                                        <Button onClick={() => handleStatusChange("Completed")} sx={buttonOffMid} variant='contained' size='small' className='appointment-detail__content__button'>
                                            Complete appointment
                                        </Button>
                                    </>
                                )}
                                <Link href={{
                                    pathname: '/appointment-detail/chat-room',  
                                    query: { slug: appointmentDetail?.id }
                                }}>
                                    <Button sx={buttonWhite} variant='contained' size='small' className='appointment-detail__content__button'>
                                        Go to chat room
                                    </Button>
                                </Link>
                                <Link href={{
                                    pathname: '/appointment-detail/update-appointment',  
                                    query: { appointmentId: appointmentDetail?.id }
                                }}>
                                    <Button sx={buttonWhite} variant='contained' size='small' className='appointment-detail__content__button'>
                                        Update Details
                                    </Button>
                                </Link>
                                {appointmentDetail?.status === "Accepted" && appointmentDetail.clientUserId === userId && (
                                    <>
                                        <Button onClick={() => handleStatusChange("Completed")} sx={buttonRed} variant='contained' size='small' className='appointment-detail__content__button'>
                                            Cancel Apppointment
                                        </Button>
                                    </>
                                )}
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
                                        <Button sx={buttonOffLight} variant='contained' size='small' className='appointment-detail__content__button'>
                                            Add review
                                        </Button>
                                    </Link>
                                </>
                            
                        )} 
                    </div>
                </div>
                <Divider className='appointment-detail__content__divider'/>
                <div className='appointment-detail__content__detail'>
                    <div className='appointment-detail__content__detail__header'>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>Title</label>
                            <p className="appointment-detail__content__data__content">{appointmentDetail?.appointmentTitle}</p>
                        </div>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>Memo</label>
                            <p className="appointment-detail__content__data__content">{appointmentDetail?.appointmentNote}</p>
                        </div>
                    </div>
                </div>
                <Divider className='appointment-detail__content__divider'/>
                <div className='appointment-detail__content__user'>
                    <div className='appointment-detail__content__user__block'>
                        <p className='appointment-detail__content__user__block__title'>Client</p>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>Name</label>
                            <p className="appointment-detail__content__data__content">{appointmentDetail?.clientUser.firstName} {appointmentDetail?.clientUser.lastName}</p>
                        </div>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>Spoken language</label>
                            <p className="appointment-detail__content__data__content">{appointmentDetail?.clientSpokenLanguage}</p>
                        </div>
                    </div>
                    <Divider orientation='vertical' variant="middle" flexItem className='appointment-detail__content__user__block__divider'/>
                    <div className='appointment-detail__content__user__block'>
                        <p className='appointment-detail__content__user__block__title'>Interpreter</p>
                        <div className='appointment-detail__content__data appointment-detail__content__user__block__right'>
                            <label className='appointment-detail__content__data__label'>Name</label>
                            <p className="appointment-detail__content__data__content">
                                {appointmentDetail?.interpreterUser?.firstName ? (<>{appointmentDetail?.interpreterUser?.firstName} {appointmentDetail?.interpreterUser?.lastName}</>) : ('-')}
                            </p>
                        </div>
                        <div className='appointment-detail__content__data appointment-detail__content__user__block__right'>
                            <label className='appointment-detail__content__data__label'>Spoken language</label>
                            <p className="appointment-detail__content__data__content">{appointmentDetail?.interpreterSpokenLanguage}</p>
                        </div>
                    </div>
                </div>
                <Divider className='appointment-detail__content__divider'/>
                <div className='appointment-detail__content__location-time'>
                    <div className='appointment-detail__content__data'>
                        <label className='appointment-detail__content__data__label'>Date and time</label>
                        <p className="appointment-detail__content__data__content">{convertedDateTime}</p>
                    </div>
                    <div className='appointment-detail__content__data'>
                        <label className='appointment-detail__content__data__label'>Location name</label>
                        <p className="appointment-detail__content__data__content">{appointmentDetail?.locationName ? appointmentDetail?.locationName : '-'}</p>
                    </div>
                    <div className='appointment-detail__content__data'>
                        <label className='appointment-detail__content__data__label'>Location address</label>
                        <p className="appointment-detail__content__data__content">{appointmentDetail?.locationAddress ? appointmentDetail?.locationAddress : '-'}</p>
                    </div>
                </div>
                <Divider className='appointment-detail__content__divider'/>
                <div className='appointment-detail__content__review'>
                    <p className='appointment-detail__content__review__header'>Review</p>
                    <div className='appointment-detail__content__review__user'>
                        <div className='appointment-detail__content__review__user__block'>
                            <p className='appointment-detail__content__review__user__block__title'>Client</p>
                        </div>
                        <Divider orientation='vertical' variant="middle" flexItem className='appointment-detail__content__review__user__block__divider'/>
                        <div className='appointment-detail__content__review__user__block'>
                            <p className='appointment-detail__content__review__user__block__title'>Interpreter</p>
                        </div>
                    </div>
                    <div className='appointment-detail__content__content__element_4'>
                        <div className='appointment-detail__content__review_client_rating'>
                            <p>review client thumb</p>
                            <p>
                                {appointmentDetail?.reviewClientThumb === true ? 'Yes' : null}
                                {appointmentDetail?.reviewClientThumb === false ? 'No' : null}
                            </p>
                        </div>
                        <div className='appointment-detail__content__review_client_note'>
                            <p>review client note</p><p>{appointmentDetail?.reviewClientNote}</p>

                        </div>
                        <div className='appointment-detail__content__review_interpreter_rating'>
                            <p>review interpreter thumb</p>
                            <p>
                                {appointmentDetail?.reviewInterpreterThumb === true ? 'Yes' : null}
                                {appointmentDetail?.reviewInterpreterThumb === false ? 'No' : null}
                            </p>
                        </div>
                        <div className='appointment-detail__content__review_interpreter_note'>
                            <p>review interpreter note</p><p>{appointmentDetail?.reviewInterpreterNote}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}