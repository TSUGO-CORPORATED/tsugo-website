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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// FOR TABS
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 2 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

// PAGE COMPONENT
export default function DashboardCard(): JSX.Element {
    // STATE VARIABLES
    const [currentTab, setCurrentTab] = useState<string>('Client');
    const [clientCurrentAppointment, setClientCurrentAppointment] = useState<AppointmentOverview[]>([]);
    const [interpreterCurrentAppointment, setInterpreterCurrentAppointment] = useState<AppointmentOverview[]>([]);

    const [tabValue, setTabValue] = useState<number>(0);
    
    // CONTEXT VARIABLES
    const { userId, userFirstName, userLastName } = useContext(ContextVariables);
    console.log(userId, userFirstName, userLastName);

    // HELPER FUNCTION
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
    const shownAppointmentBlock = currentTab === 'Client' ? clientCurrentAppointment : interpreterCurrentAppointment;
    
    // JSX ELEMENTS
    return (
        <div className='dashboard__card'>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        aria-label="basic tabs example"
                        centered
                        variant='fullWidth'
                        TabIndicatorProps={{style: {background:'#483c33'}}}
                        sx={{
                            //   backgroundColor: 'black',
                            '.MuiTab-textColorPrimary': {
                                fontSize: 20,
                            },
                            ".Mui-selected": {
                                color: '#483c33',
                                // backgroundColor: 'white',
                                fontWeight: 'bold',
                                fontSize: 20,
                            }
                        }}
                    >
                        <Tab label="Client" {...a11yProps(0)} icon={<EmojiPeopleIcon />} />
                        <Tab label="Translator" {...a11yProps(1)} icon={<RecordVoiceOverIcon />} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                    <div className='dashboard__card__role-content'>
                        {/* <div className='dashboard__card__role-content__button-column'>
                            {currentTab === 'Client' ? (
                                <>
                                    <Link href="/add-request">
                                        <Button variant='contained' sx={buttonBlack} size='medium'>
                                            <div className="dashboard__card__role-content__button-column__button-request">
                                                <AddCircleOutlineIcon />
                                                <p>Add Request</p>
                                            </div>
                                        </Button>
                                    </Link>
                                    <Link href={{
                                        pathname: "/history",
                                        query: {slug: "client"},
                                    }}>
                                        <Button variant='outlined' sx={buttonWhite} size='medium'>
                                            <div className="dashboard__card__role-content__button-column__button-history">
                                                <LibraryBooksIcon />
                                                <p>History</p>
                                            </div>
                                        </Button>
                                    </Link>
                                </>
                            ) : 
                            <>
                                <Link href="/find-request" className="dashboard__card__role-content__button-row__button-request">
                                    <div>Find Request</div>
                                </Link>
                                <Link href={{
                                    pathname: "/history",
                                    query: {slug: "interpreter"}
                                }} className="dashboard__card__role-content__button-row__button-history">
                                    <div>History</div>
                                </Link>
                            </>}
                        </div> */}
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    Translator
                </CustomTabPanel>
            </Box>
            <div className='dashboard__card'>
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
                                    pathname: "/history",
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
                                pathname: "/history",
                                query: {slug: "interpreter"}
                            }} className="dashboard__card__role-content__button-row__button-history">
                                <div>History</div>
                            </Link>
                        </>}
                    </div>
                    <div className='dashboard__card__role-content__list-title'>Current Appointment</div>
                    <div className='dashboard__card__role-content__appointment-list'>
                        <AppointmentBlock appointment={shownAppointmentBlock}/>
                    </div>
                </div>
            </div>
        </div>
    )
}