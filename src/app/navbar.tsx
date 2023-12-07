'use client'

// IMPORT MODULES
import React, {useContext, useState, useEffect} from 'react';
import Link from 'next/link';
import { ContextVariables } from '@/context-variables';
import { signOut } from 'firebase/auth';
import { auth } from "../firebase";
import { useRouter } from 'next/navigation';
import { buttonWhite, buttonRed } from '@/muistyle';
// import { useTranslation } from 'next-i18next'; 
// import { IoMdGlobe } from 'react-icons/io';
// import LanguageSwitcher from './languageswitcher';


// From MUI
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Logout from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';


// JSX COMPONENTS
export default function Navbar() {
    // STATE VARIABLES, CONTEXT VARIABLES, DESIGNATION
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [signOutWindowOpen, setSignOutWindowOpen] = useState<boolean>(false);


    const { userUid, userPhotoUrl, userFirstName, setUserId, setUserUid, setUserFirstName, setUserLastName } = useContext(ContextVariables);
    // console.log(userPhotoUrl)
    const avatarOpen = Boolean(anchorEl);
    const router = useRouter();


    // INTERNATIONALIZATION
    // const { i18n } = useTranslation(); 
    // const changeLanguage = (language: string) => { 
    //     i18n.changeLanguage(language);
    // };

    // HELPER FUNCTION
    // Dropdown menu bar
    function avatarHandleClick (event: React.MouseEvent<HTMLButtonElement>) {
      setAnchorEl(event.currentTarget);
    };
    function avatarHandleClose () {
      setAnchorEl(null);
    };

    // Sign out
    const signOutWindowStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        // border: '2px solid #000',
        boxShadow: 2,
        p: 4,
      };

    function signOutWindowHandleOpen(): void {
        avatarHandleClose();
        setSignOutWindowOpen(true);
    };
    function signOutWindowHandleClose(): void {
        setSignOutWindowOpen(false);
    } 

    function userSignOut(): void {
        signOut(auth)
            .then(() => {
                // Reset context variables
                setUserId(0);
                setUserUid('noUid');
                setUserFirstName('noFirstName');
                setUserLastName('noLastName');
        
                // Close window
                setSignOutWindowOpen(false);


                // Push to homepage
                router.push('/');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // useEffect(() => {
    //     setSignOutWindowOpen(false);
    // }, []);

    return (
            <div className='navbar'>
                <div className='navbar__cont'>
                    {userUid == 'noUid' ? (
                        <>
                            <div className='navbar__cont__left'>
                                <Link href="/" >
                                    <Button variant='text' className='navbar__cont__left__logo'>
                                        Tsugo/都合
                                    </Button>
                                </Link>
                            </div>
                            <div className='navbar__cont__right'>
                                <Link href="/sign-up">
                                    <Button variant='text' className='navbar__cont__right__sign-up'>
                                        Sign up
                                    </Button>
                                </Link>
                                <Link href="/log-in" >
                                    <Button variant='text' className='navbar__cont__right__log-in'>
                                        Log in
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='navbar__cont__left'>
                                <Link href="/dashboard" className='navbar__cont__left__logo'>Tsugo/都合</Link>
                            </div>
                            <div className='navbar__cont__right'>
                                <Button onClick={avatarHandleClick}>
                                    <div className='navbar__cont__right__avatar'>
                                        <p className='navbar__cont__right__avatar__first-name'>{userFirstName}</p>
                                        {userPhotoUrl !== 'noPhotoUrl' ? (
                                        <Avatar 
                                            src={userPhotoUrl} 
                                            sx={{ width: 25, height: 25 }}
                                        />  
                                        ) : (
                                            <Avatar 
                                            sx={{ width: 25, height: 25 }}
                                        />  
                                        )}
                                        <MoreVertIcon 
                                            fontSize='medium'
                                        />
                                    </div>
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={avatarOpen}
                                    onClose={avatarHandleClose}
                                    PaperProps={{
                                        elevation: 5,
                                        sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={avatarHandleClose}>
                                        <Link href="/profile" className='navbar__cont__right__avatar__profile'>
                                            <Avatar />
                                            Profile
                                        </Link>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={avatarHandleClose}>
                                        <Link href="/dashboard" className='navbar__cont__right__avatar__dashboard'>
                                            <ListItemIcon>
                                                <HomeIcon fontSize="small" />
                                            </ListItemIcon>
                                            Dashboard
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={signOutWindowHandleOpen}>
                                        <div className='navbar__cont__right__avatar__sign-out'>
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Sign Out
                                        </div>
                                    </MenuItem>
                                </Menu>
                                <Modal
                                    open={signOutWindowOpen}
                                    onClose={signOutWindowHandleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    disableEnforceFocus
                                >
                                    <Box sx={signOutWindowStyle} className='navbar__cont__right__sign-out-window'>
                                        <div className='navbar__cont__right__sign-out-window__title'>Confirm Log-out</div>
                                        <div className='navbar__cont__right__sign-out-window__description'>Are you sure you want to log-out?</div>
                                        <div className='navbar__cont__right__sign-out-window__button'>
                                            <Button variant='outlined' onClick={signOutWindowHandleClose} sx={buttonWhite}>Cancel</Button>
                                            <Button variant='contained' onClick={userSignOut} sx={buttonRed}>Confirm</Button>
                                        </div>
                                    </Box>
                                </Modal>
                            </div>
                        </>
                    )}
                </div>
            </div>
    )
}