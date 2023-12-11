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
import { usePathname } from 'next/navigation';
import dayjs, { Dayjs } from "dayjs";

// MUI IMPORT
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import CircularProgress from '@mui/material/CircularProgress';

// MODAL
const detailModalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    borderRadius: 2,
    boxShadow: 2,
    // p: 4,
};

// PAGE COMPONENT
export default function AppointmentDetail({appointmentId, openDetailModal, closeDetailModal, refresh, load}: {appointmentId: number, openDetailModal: boolean, closeDetailModal: any, refresh?: Function, load: boolean}): JSX.Element {
    // TYPESCRIPT DATA TYPES
    interface AppointmentDetail {
        id: number;
        appointmentTitle: string,
        appointmentType: string,
        mainCategory: string | null,
        subCategory: string | null,
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
    const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail | undefined>(undefined);
    const [isAgreed, setIsAgreed] = useState<boolean>(false);
    const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
    const [showAcceptModal, setShowAcceptModal] = useState<boolean>(false);
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
    const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname();
    // console.log(pathname);

    // CONTEXT VARIABLES
    const { userId } = useContext(ContextVariables);

    // HELPER FUNCTION
    // Get appointment detail information
    async function getAppointmentDetail(): Promise<void> {
        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/detail/${appointmentId}`;
        const retrievedData = await axios.get(url);
        // console.log(retrievedData.data);
        setAppointmentDetail(retrievedData.data);
    }

    // Handle status change
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

            // Guard clause to prevent accepting request without agreeing
            if (newStatus === 'Accepted' && isAgreed === false) {
                alert('You must agree to the disclaimer first');
                return;
            } 

            // Updating backend
            await axios.patch(url);
            // alert(`Appointment ${newStatus} successfully!`);

            // Refresh or redirect to dashboard
            if (pathname === '/dashboard') {
                // router.replace('/dashboard');
                setShowAcceptModal(false);
                setShowCancelModal(false);
                closeDetailModal();
                if(refresh) refresh();
            } else {
                router.push('/dashboard');
            }
            
        } catch (error) {
          console.error(`Error updating appointment status: `, error);
          alert("Failed to update appointment status.");
        }
    };

    // Handle accept modal
    function handleOpenAcceptModal () {
        setShowAcceptModal(true);
    }
    function handleCloseAcceptModal () {
        setShowAcceptModal(false);
    }

    // Handle cancel modal
    function handleOpenCancelModal () {
        setShowCancelModal(true);
    }
    function handleCloseCancelModal () {
        setShowCancelModal(false);
    }

    // Handle complete modal
    function handleOpenCompleteModal () {
        setShowCompleteModal(true);
    }
    function handleCloseCompleteModal () {
        setShowCompleteModal(false);
    }

    // Handle agreement modal
    const handleOpenDisclaimerModal = () => {
        setShowDisclaimerModal(true);
      };
    
    const handleCloseDisclaimerModal = () => {
        setShowDisclaimerModal(false);
    };
    
    // Initial Use effect
    // Only load modal only if the modal is clicked
    useEffect(() => {
        if(load === true) {
            getAppointmentDetail()
            setLoading(false);
        };
        if(load === false) {
            setAppointmentDetail(undefined);
            setLoading(false);
        };
    }, [load]);

    // Process date
    const tempDateTime = appointmentDetail?.appointmentDateTime;
    const convertedDateTime = tempDateTime ? dayjs(tempDateTime).format("MM/DD/YYYY HH:mm ") : null;

    
    // Process location name
    const locationName = appointmentDetail?.locationName ? appointmentDetail.locationName : '-';
    const words = locationName.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    const processLocationName = words.join(" ");

    // LOADING
    if (loading) {
        return <CircularProgress />; 
      }

    // JSX ELEMENTS       
    return (
        <Modal
            open={openDetailModal}
            onClose={closeDetailModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            // sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.2)'} }}
        >
            <Box sx={detailModalStyle} className='appointment-detail'>
                <div className='appointment-detail__header'>
                    <p className='appointment-detail__header__title'>Appointment Detail</p>              
                    <Button onClick={closeDetailModal} sx={{color: 'black', minWidth: '0'}} variant='text' className="appointment-detail__header__link-button">
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
                            {/* Modal confirmation */}
                            <Modal
                                open={showAcceptModal}
                                onClose={handleCloseAcceptModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                // sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.2)'} }}
                            >
                                {showDisclaimerModal ? (
                                    <Box sx={detailModalStyle} className='appointment-detail__disclaimer-modal'>
                                        {/* <Disclaimer handleCloseModal={handleCloseDisclaimerModal}/> */}
                                        <div className="appointment-detail__disclaimer-modal__box">
                                            <Button onClick={handleCloseDisclaimerModal} sx={{color: 'black', minWidth: '0', minHeight: '0'}} variant='text' className="appointment-detail__disclaimer-modal__box__button">
                                                <CloseIcon />
                                            </Button>
                                        </div>
                                        <Disclaimer />
                                    </Box>
                                ) : (
                                    <Box sx={detailModalStyle} className='appointment-detail__accept-modal'>
                                        <div className='appointment-detail__accept-modal__title'>Confirm Accept Appointment</div>
                                        <div className='appointment-detail__accept-modal__agreement'>
                                            <div className='appointment-detail__accept-modal__agreement__check'>
                                                <input
                                                    type="checkbox"
                                                    checked={isAgreed}
                                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                                    required
                                                    className="add_request_checkbox"
                                                />
                                                <p className='appointment-detail__accept-modal__agreement__check__text'>
                                                    I agree to the <span onClick={handleOpenDisclaimerModal} className="appointment-detail__accept-modal__agreement__check__link">Terms and Conditions.</span>
                                                </p>
                                            </div>
                                            <div className='appointment-detail__accept-modal__agreement__note'>
                                                Note: our site prohibits any financial transactions through its platform and accepts no liability for any issues arising from interpretation services.
                                            </div>
                                        </div>
                                        <div className='appointment-detail__accept-modal__button'>
                                            <Button variant='outlined' onClick={handleCloseAcceptModal} sx={buttonWhite}>Cancel</Button>
                                            <Button variant='contained' onClick={() => handleStatusChange("Accepted")} sx={buttonOffDark}>Confirm</Button>
                                        </div>
                                    </Box>
                                )}
                            </Modal>
                            <Modal
                                open={showCancelModal}
                                onClose={handleCloseCancelModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                // sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.2)'}  }}
                            >
                                <Box sx={detailModalStyle} className='appointment-detail__cancel-modal'>
                                    <div className='appointment-detail__cancel-modal__title'>Confirm Cancel Appointment</div>
                                    <div className='appointment-detail__cancel-modal__button'>
                                        <Button variant='outlined' onClick={handleCloseCancelModal} sx={buttonWhite}>Cancel</Button>
                                        <Button variant='contained' onClick={() => handleStatusChange("Cancelled")} sx={buttonRed}>Confirm</Button>
                                    </div>
                                </Box>
                            </Modal>
                            <Modal
                                open={showCompleteModal}
                                onClose={handleCloseCompleteModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                // sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.2)'} }}
                            >
                                <Box sx={detailModalStyle} className='appointment-detail__complete-modal'>
                                    <div className='appointment-detail__complete-modal__title'>Confirm Complete Appointment</div>
                                    <div className='appointment-detail__complete-modal__button'>
                                        <Button variant='outlined' onClick={handleCloseCompleteModal} sx={buttonWhite}>Cancel</Button>
                                        <Button variant='contained' onClick={() => handleStatusChange("Completed")} sx={buttonOffDark}>Confirm</Button>
                                    </div>
                                </Box>
                            </Modal>

                            {/* Change status button */}
                            {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId !== userId && (
                                <>            
                                    {/* <div className="appointment-detail__content_check_box">
                                    <label className="appointment-detail__content_check_label">
                                        <input
                                        type="checkbox"
                                        checked={isAgreed}
                                        onChange={(e) => setIsAgreed(e.target.checked)}
                                        required
                                        className="add_request_checkbox"
                                        />
                                        <span className="appointment-detail__content_agree">
                                            I agree to the <span onClick={handleOpenDisclaimerModal} className="appointment-detail_disclaimer-link">Disclaimer</span><br></br>
                                            Our site prohibits any financial transactions through its platform and<br></br>
                                            accepts no liability for any issues arising from interpretation services.
                                        </span>
                                    </ label>
                                    </div>
                                    {showModal && (
                                        <Disclaimer handleCloseModal={handleCloseDisclaimerModal} />
                                    )} */}
                                    <Button onClick={handleOpenAcceptModal} sx={buttonOffMid} variant='contained'>
                                        <p className='appointment-detail__content__button'>Accept appointment</p>
                                    </Button>
                                    {/* <Modal
                                        open={showAcceptModal}
                                        onClose={handleCloseAcceptModal}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                        // sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.2)'} }}
                                    >
                                            <Box sx={detailModalStyle} className='appointment-detail__accept-modal'>
                                                <div className='appointment-detail__accept-modal__title'>Confirm Accept Appointment</div>
                                                <div className='appointment-detail__accept-modal__agreement'>
                                                    <div className='appointment-detail__accept-modal__agreement__check'>
                                                        <input
                                                            type="checkbox"
                                                            checked={isAgreed}
                                                            onChange={(e) => setIsAgreed(e.target.checked)}
                                                            required
                                                            className="add_request_checkbox"
                                                        />
                                                        <p className='appointment-detail__accept-modal__agreement__check__text'>
                                                            I agree to the <span onClick={handleOpenDisclaimerModal} className="appointment-detail__accept-modal__agreement__check__link">disclaimer</span>
                                                        </p>
                                                    </div>
                                                    <div className='appointment-detail__accept-modal__agreement__note'>
                                                        Note: our site prohibits any financial transactions through its platform and accepts no liability for any issues arising from interpretation services.
                                                    </div>
                                                </div>
                                                <div className='appointment-detail__accept-modal__button'>
                                                    <Button variant='outlined' onClick={handleCloseAcceptModal} sx={buttonWhite}>Cancel</Button>
                                                    <Button variant='contained' onClick={() => handleStatusChange("Accepted")} sx={buttonOffDark}>Confirm</Button>
                                                </div>
                                            </Box>
                                    </Modal> */}
                                </>
                            )}
                            {appointmentDetail?.status === "Requested" && appointmentDetail.clientUserId === userId && (
                                <>
                                    <Link href={{
                                        pathname: '/appointment-detail/update-appointment',  
                                        query: { appointmentId: appointmentDetail?.id }
                                    }}>
                                        {/* <button className='chat_room_button'>Update appointment</button> */}
                                        <Button sx={buttonOffMid} variant='contained' >
                                            <p className='appointment-detail__content__button'>Update Appointment</p>
                                        </Button>
                                    </Link>
                                    <Button onClick={handleOpenCancelModal} sx={buttonRed} variant='contained'>
                                        <p className='appointment-detail__content__button'>Cancel appointment</p>
                                    </Button>
                                </>
                            )}
                            {appointmentDetail?.status === "Accepted" && (
                                <>
                                    {appointmentDetail.clientUserId === userId && (
                                        <>
                                            <Button onClick={handleOpenCompleteModal} sx={buttonOffMid} variant='contained'>
                                                <p className='appointment-detail__content__button'>Complete appointment</p>
                                            </Button>
                                        </>
                                    )}
                                    <Link href={{
                                        pathname: '/appointment-detail/chat-room',  
                                        query: { slug: appointmentDetail?.id }
                                    }}>
                                        <Button sx={buttonOffMid} variant='contained'>
                                            <p className='appointment-detail__content__button'>Go to chat room</p>
                                        </Button>
                                    </Link>
                                    <Link href={{
                                        pathname: '/appointment-detail/update-appointment',  
                                        query: { appointmentId: appointmentDetail?.id }
                                    }}>
                                        <Button sx={buttonOffMid} variant='contained'>
                                            <p className='appointment-detail__content__button'>Update Details</p>
                                        </Button>
                                    </Link>
                                    {appointmentDetail?.status === "Accepted" && appointmentDetail.clientUserId === userId && (
                                        <>
                                         <Button onClick={handleOpenCancelModal} sx={buttonRed} variant='contained'>
                                            <p className='appointment-detail__content__button'>Cancel appointment</p>
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
                                            <Button sx={buttonOffMid} variant='contained'>
                                                <p className='appointment-detail__content__button'>Add review</p>
                                            </Button>
                                        </Link>
                                    </>
                                
                            )} 
                        </div>
                    </div>
                    <Divider sx={{marginTop: '10px', marginBottom: '10px'}}/>
                    <div className='appointment-detail__content__detail'>
                        <div className='appointment-detail__content__detail__header'>
                            <div className='appointment-detail__content__data'>
                                <label className='appointment-detail__content__data__label'>Title</label>
                                <p className="appointment-detail__content__data__content">{appointmentDetail?.appointmentTitle}</p>
                            </div>
                            <div className='appointment-detail__content__data'>
                                <label className='appointment-detail__content__data__label'>Category</label>
                                <p className="appointment-detail__content__data__content">{appointmentDetail?.mainCategory ? appointmentDetail?.mainCategory + " - " + appointmentDetail?.subCategory: '-'}</p>
                            </div>
                            <div className='appointment-detail__content__data'>
                                <label className='appointment-detail__content__data__label'>Memo</label>
                                <p className="appointment-detail__content__data__content">{appointmentDetail?.appointmentNote ? appointmentDetail?.appointmentNote : '-'}</p>
                            </div>
                        </div>
                    </div>
                    <Divider sx={{marginTop: '10px', marginBottom: '10px'}}/>
                    <div className='appointment-detail__content__user'>
                        <div className='appointment-detail__content__user__block'>
                            <p className='appointment-detail__content__user__block__title'>Client</p>
                            <div className='appointment-detail__content__data'>
                                <label className='appointment-detail__content__data__label'>Name</label>
                                <p className="appointment-detail__content__data__content">{appointmentDetail?.clientUser.firstName} {appointmentDetail?.clientUser.lastName}</p>
                            </div>
                            <div className='appointment-detail__content__data'>
                                <label className='appointment-detail__content__data__label'>Communication language</label>
                                <p className="appointment-detail__content__data__content">{appointmentDetail?.clientSpokenLanguage}</p>
                            </div>
                        </div>
                        <Divider orientation='vertical' variant="middle" flexItem sx={{marginRight: '10px'}}/>
                        <div className='appointment-detail__content__user__block'>
                            <p className='appointment-detail__content__user__block__title'>Interpreter</p>
                            <div className='appointment-detail__content__data appointment-detail__content__user__block__right'>
                                <label className='appointment-detail__content__data__label'>Name</label>
                                <p className="appointment-detail__content__data__content">
                                    {appointmentDetail?.interpreterUser?.firstName ? (<>{appointmentDetail?.interpreterUser?.firstName} {appointmentDetail?.interpreterUser?.lastName}</>) : ('-')}
                                </p>
                            </div>
                            <div className='appointment-detail__content__data appointment-detail__content__user__block__right'>
                                <label className='appointment-detail__content__data__label'>Desired language</label>
                                <p className="appointment-detail__content__data__content">{appointmentDetail?.interpreterSpokenLanguage}</p>
                            </div>
                        </div>
                    </div>
                    <Divider sx={{marginTop: '10px', marginBottom: '10px'}}/>
                    <div className='appointment-detail__content__location-time'>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>Date and time</label>
                            <p className="appointment-detail__content__data__content">{convertedDateTime}</p>
                        </div>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>Location name</label>
                            <p className="appointment-detail__content__data__content">{processLocationName}</p>
                        </div>
                        <div className='appointment-detail__content__data'>
                            <label className='appointment-detail__content__data__label'>Location address</label>
                            <p className="appointment-detail__content__data__content">{appointmentDetail?.locationAddress ? appointmentDetail?.locationAddress : '-'}</p>
                        </div>
                    </div>
                    <Divider sx={{marginTop: '10px', marginBottom: '10px'}}/>
                    <div className='appointment-detail__content__review'>
                        <p className='appointment-detail__content__review__header'>Review</p>
                        <div className='appointment-detail__content__review__user'>
                            <div className='appointment-detail__content__review__user__block'>
                                <p className='appointment-detail__content__review__user__block__title'>Client</p>
                                <div className='appointment-detail__content__review__user__block__thumb'>
                                    {appointmentDetail?.reviewClientThumb === true ? <ThumbUpIcon  sx={{fontSize:'30px'}}/> : <ThumbUpOffAltIcon sx={{fontSize:'30px'}} />}
                                    {appointmentDetail?.reviewClientThumb === false ? <ThumbDownIcon sx={{fontSize:'30px'}}/> : <ThumbDownOffAltIcon sx={{fontSize:'30px'}}/>}
                                </div>
                                <div className='appointment-detail__content__review__user__block__note'>{appointmentDetail?.reviewClientNote ? appointmentDetail?.reviewClientNote : 'No review yet'}</div>
                            </div>
                            <Divider orientation='vertical' variant="middle" flexItem sx={{marginRight: '10px'}}/>
                            <div className='appointment-detail__content__review__user__block'>
                                <p className='appointment-detail__content__review__user__block__title'>Interpreter</p>
                                <div className='appointment-detail__content__review__user__block__thumb'>
                                    {appointmentDetail?.reviewInterpreterThumb === true ? <ThumbUpIcon  sx={{fontSize:'30px'}}/> : <ThumbUpOffAltIcon sx={{fontSize:'30px'}} />}
                                    {appointmentDetail?.reviewInterpreterThumb === false ? <ThumbDownIcon sx={{fontSize:'30px'}}/> : <ThumbDownOffAltIcon sx={{fontSize:'30px'}}/>}
                                </div>
                                <p className='appointment-detail__content__review__user__block__note'>{appointmentDetail?.reviewInterpreterNote ? appointmentDetail?.reviewInterpreterNote : 'No review yet'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}