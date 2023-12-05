'use client';

// MODULES IMPORT
import { useState, useContext, useEffect } from 'react';
import { ContextVariables } from '../../context-variables';
import Link from 'next/link';
import axios from 'axios';
import AppointmentBlock from '../global/appointment-block';
import { buttonBlack, buttonWhite } from '@/muistyle';

// IMPORT FROM MUI
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';

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

// PAGE COMPONENT
export default function DashboardCard(): JSX.Element {
    // STATE VARIABLES
    const [clientCurrentAppointment, setClientCurrentAppointment] = useState<AppointmentOverview[]>([]);
    const [interpreterCurrentAppointment, setInterpreterCurrentAppointment] = useState<AppointmentOverview[]>([]);

    const [tabValue, setTabValue] = useState<number>(0);
    
    // CONTEXT VARIABLES
    const { userId, userFirstName, userLastName } = useContext(ContextVariables);
    console.log(userId, userFirstName, userLastName);

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
    const shownAppointmentBlock = tabValue === 0 ? clientCurrentAppointment : interpreterCurrentAppointment;
    
    // JSX ELEMENTS
    return (
        <div className='dashboard__card'>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    aria-label="basic tabs example"
                    centered
                    variant='fullWidth'
                    TabIndicatorProps={{
                        sx: {
                            bgcolor: '#483c33',
                            // height: "10px",
                        }
                    }}
                    sx={{
                        '.MuiTab-textColorPrimary': {
                            // fontSize: 20,
                        },
                        ".MuiTab-root.Mui-selected": {
                            color: '#483c33',
                            // backgroundColor: '#f3f3f3',
                            fontWeight: 'bold',
                            fontSize: 20,
                        }
                    }}
                >
                    <Tab label="Client" {...a11yProps(0)} icon={<EmojiPeopleIcon />} />
                    <Tab label="Translator" {...a11yProps(1)} icon={<RecordVoiceOverIcon />} />
                </Tabs>
            </Box>
            <div className='dashboard__card__role-content'> 
                <div className='dashboard__card__role-content__button-column'>
                    {tabValue === 0 && (
                        <>
                            <Link href="/add-request" className='dashboard__card__role-content__button-column__link'>
                                <Button variant='contained' sx={buttonBlack} size='medium' className='dashboard__card__role-content__button-column__link__button'>
                                    <div className="dashboard__card__role-content__button-column__link__button__title">
                                        <AddCircleOutlineIcon />
                                        <p>Create Appointment</p>
                                    </div>
                                    <p className="dashboard__card__role-content__button-column__link__button__desc">Get help from interpreter</p>
                                </Button>
                            </Link>
                            <Link href={{
                                pathname: "/history",
                                query: {slug: "client"},
                            }} className='dashboard__card__role-content__button-column__link'>
                                <Button variant='outlined' sx={buttonWhite} size='medium' className='dashboard__card__role-content__button-column__link__button'>
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
                                <Button variant='contained' sx={buttonBlack} size='medium' className='dashboard__card__role-content__button-column__link__button'>
                                    <div className="dashboard__card__role-content__button-column__link__button__title">
                                        <SearchIcon />
                                        <p>Find Request</p>
                                    </div>
                                    <p className="dashboard__card__role-content__button-column__link__button__desc">See your appointment history</p>
                                </Button>
                            </Link>
                            <Link href={{
                                pathname: "/history",
                                query: {slug: "interpreter"},
                            }} className='dashboard__card__role-content__button-column__link'>
                                <Button variant='outlined' sx={buttonWhite} size='medium' className='dashboard__card__role-content__button-column__link__button'>
                                    <div className="dashboard__card__role-content__button-column__link__button__title">
                                        <LibraryBooksIcon />
                                        <p>Open History</p>
                                    </div>
                                    <p className="dashboard__card__role-content__button-column__link__button__desc">See your help history</p>
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
                <div className='dashboard__card__role-content__list-title'>Ongoing Appointment</div>
                <div className='dashboard__card__role-content__appointment-list'>
                    <AppointmentBlock appointment={shownAppointmentBlock}/>
                </div>
            </div>
        </div>
    )
}