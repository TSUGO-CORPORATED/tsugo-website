'use client';

// MODULES IMPORT
import { useState, useContext, useEffect } from 'react';
import { ContextVariables } from '../../context-variables';
import Link from 'next/link';
import axios from 'axios';
import AppointmentBlock from '../global/appointment-block';
import { colorOffDark, colorOffLight, colorOffMid, buttonOffDark, buttonOffLight, buttonOffMid, buttonBlack, buttonWhite } from '@/muistyle';

// IMPORT FROM MUI
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

// INTERFACE 
interface AppointmentOverview {
    id: number;
    status: string;
    appointmentTitle: string,
    appointmentType: string,
    mainCategory: string | null,
    subCategory: string | null,
    clientSpokenLanguage: string;
    interpreterSpokenLanguage: string;
    locationName: string | null;
    locationLatitude: number | null;
    locationLongitude: number | null;
    appointmentDateTime: Date;
}

// PAGE COMPONENT
export default function DashboardCard(): JSX.Element {
    // STATE VARIABLES
    const [clientCurrentAppointment, setClientCurrentAppointment] = useState<AppointmentOverview[]>([]);
    const [interpreterCurrentAppointment, setInterpreterCurrentAppointment] = useState<AppointmentOverview[]>([]);
    const [tabValue, setTabValue] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    // CONTEXT VARIABLES
    const { userId, userFirstName, userLastName } = useContext(ContextVariables);
    // console.log(userId, userFirstName, userLastName);

    // HELPER FUNCTION
    // For tab
    function a11yProps(index: number) {
        return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    function handleTabChange(event: React.SyntheticEvent, newValue: number) {
        setTabValue(newValue);
    };

    // Get client and interpreter current appointment
    async function getClientInterpreterCurrentAppointment(): Promise<void> {
        const urlClient: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/overview/client/current/${userId}`;
        const retrievedDataClient = await axios.get(urlClient);
        // console.log(retrievedDataClient);
        setClientCurrentAppointment(retrievedDataClient.data);

        const urlInterpreter: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/overview/interpreter/current/${userId}`;
        const retrievedDataInterpreter = await axios.get(urlInterpreter);
        // console.log(retrievedDataInterpreter);
        setInterpreterCurrentAppointment(retrievedDataInterpreter.data);
    }
    // INITIAL USE EFFECT
    useEffect(() => {
        if (userId !== 0) {
            getClientInterpreterCurrentAppointment();
            setLoading(false);
        }
    }, [userId]);

   
    if (loading) {
        return <CircularProgress />; 
      }
     // JSX ELEMENTS
    return (
        <div className='dashboard__card'>
            <Box 
                // sx={{ borderBottom: 2, borderColor: 'divider' }}
                className='dashboard__card__tab'
            >
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    aria-label="basic tabs example"
                    centered
                    variant='fullWidth'
                    TabIndicatorProps={{
                        sx: {
                            bgcolor: colorOffDark,
                            // height: "10px",
                        }
                    }}
                    sx={{
                        ".MuiTab-root.Mui-selected": {
                            color: colorOffDark,
                            // backgroundColor: '#f3f3f3',
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        borderBottom: 2, 
                        borderColor: 'divider' 
                    }}
                >
                    <Tab label="Client" {...a11yProps(0)} icon={<EmojiPeopleIcon />} />
                    <Tab label="Interpreter" {...a11yProps(1)} icon={<RecordVoiceOverIcon />} />
                </Tabs>
            </Box>
            <div className='dashboard__card__role-content'> 
                <div className='dashboard__card__role-content__button-column'>
                    <Paper elevation={3} className='dashboard__card__role-content__button-column__paper'>
                        {tabValue === 0 && (
                            <>
                                <Link href="/add-request" className='dashboard__card__role-content__button-column__link'>
                                    <Button variant='contained' sx={buttonOffMid} className='dashboard__card__role-content__button-column__link__button'>
                                        <div className="dashboard__card__role-content__button-column__link__button__title">
                                            <AddCircleOutlineIcon />
                                            <p>New Request</p>
                                        </div>
                                        <p className="dashboard__card__role-content__button-column__link__button__desc">Get help from interpreter</p>
                                    </Button>
                                </Link>
                                <Link href={{
                                    pathname: "/history",
                                    query: {role: "client"},
                                }} className='dashboard__card__role-content__button-column__link'>
                                    <Button variant='contained' sx={buttonOffMid} className='dashboard__card__role-content__button-column__link__button'>
                                        <div className="dashboard__card__role-content__button-column__link__button__title">
                                            <LibraryBooksIcon />
                                            <p>Open History</p>
                                        </div>
                                        <p className="dashboard__card__role-content__button-column__link__button__desc">See your request history</p>
                                    </Button>
                                </Link>
                            </>
                        )}
                        {tabValue === 1 && (
                            <>
                                <Link href="/find-request" className='dashboard__card__role-content__button-column__link'>
                                    <Button variant='contained' sx={buttonOffMid} className='dashboard__card__role-content__button-column__link__button'>
                                        <div className="dashboard__card__role-content__button-column__link__button__title">
                                            <SearchIcon />
                                            <p>Find Request</p>
                                        </div>
                                        <p className="dashboard__card__role-content__button-column__link__button__desc">See your appointment history</p>
                                    </Button>
                                </Link>
                                <Link href={{
                                    pathname: "/history",
                                    query: {role: "interpreter"},
                                }} className='dashboard__card__role-content__button-column__link'>
                                    <Button variant='contained' sx={buttonOffMid} className='dashboard__card__role-content__button-column__link__button'>
                                        <div className="dashboard__card__role-content__button-column__link__button__title">
                                            <LibraryBooksIcon />
                                            <p>Open History</p>
                                        </div>
                                        <p className="dashboard__card__role-content__button-column__link__button__desc">See your help history</p>
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Paper>
                </div>
                <div className='dashboard__card__role-content__appointment-column'>
                    <Paper elevation={4} className='dashboard__card__role-content__appointment-column__paper'>
                        <div className='dashboard__card__role-content__appointment-column__paper__list-title'>Ongoing Appointment</div>
                        <div className='dashboard__card__role-content__appointment-column__paper__appointment-list'>
                            {tabValue === 0 && clientCurrentAppointment.length !== 0 && (
                                <AppointmentBlock appointment={clientCurrentAppointment} refresh={getClientInterpreterCurrentAppointment}/>  
                            )}
                            {tabValue === 0 && clientCurrentAppointment.length === 0 && (
                                <div>No Ongoing Appointment</div>
                            )}
                            {tabValue === 1 && interpreterCurrentAppointment.length !== 0 && (
                                <AppointmentBlock appointment={interpreterCurrentAppointment} refresh={getClientInterpreterCurrentAppointment}/>  
                            )} 
                            {tabValue === 1 && interpreterCurrentAppointment.length === 0 && (
                                <div>No Ongoing Appointment</div>
                            )}
                        </div>
                    </Paper>
                </div>
            </div>
        </div>
    )
}