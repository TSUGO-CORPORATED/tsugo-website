'use client';

// MODULES IMPORT
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, TextField, Paper, Box } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { buttonWhite, buttonOffMid } from '@/muistyle';


export default function ReviewCard() {
    // STATE VARIABLES
    const [reviewThumb, setReviewThumb] = useState<boolean | undefined>();
    const [reviewNote, setReviewNote] = useState<string>("");
    const [reviewThumbUp, setReviewThumbUp] = useState<boolean>(false);
    const [reviewThumbDown, setReviewThumbDown] = useState<boolean>(false);
    
    const router = useRouter();

    // SEARCH PARAMS
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');
    const role = searchParams.get('role');
    // console.log("ID",appointmentId);
    // console.log("role",role);

    // HELPER FUNCTION
    async function submitReview(event: React.FormEvent) {
        event.preventDefault();
        const reviewData = {
            appointmentId: Number(appointmentId),
            role: role,
            reviewThumb: reviewThumb,
            reviewNote: reviewNote,
        }
        console.log("reveiwdata", reviewData);
        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/review`;
        await axios.patch(url, reviewData);
        alert('Review submitted successfully!');
        router.push(`/appointment-detail?appointmentId=${appointmentId}`);
    };

    useEffect(() => {
        console.log("thumb",reviewThumb);
    }, [reviewThumb]);

    const handleThumbClick = (isThumbUp: boolean) => {
        setReviewThumb((prevReviewThumb: boolean | undefined) => {
            if (prevReviewThumb !== isThumbUp) {
                setReviewThumbUp(isThumbUp);
                setReviewThumbDown(!isThumbUp);
            }
            return isThumbUp;
        });
       
    };

    return (
        <Paper className='review__container' elevation={3}>
            <h1 className='review__header'>Review</h1>
            <Box className='review__form' onSubmit={submitReview}>
                {/* <label>Rating</label>
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} required>
                <option disabled> -- Select Rating -- </option>
                    {ratingValue.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
                <p>The rating is: {reviewRating}</p> */}
                <p className='review__question'>How would you rate your experience?</p>
                <div className='review__thumb-container'>
                    <div className='review__thumb-up' 
                        onClick={() => handleThumbClick(true)}> 
                        {reviewThumbUp === true ? <ThumbUpIcon sx={{fontSize:'100px'}}/> : <ThumbUpOffAltIcon sx={{fontSize:'100px'}}/>}
                    </div>
                    <div className='review__thumb-down' 
                        onClick={() => handleThumbClick(false)}>
                            {reviewThumbDown === true ? <ThumbDownIcon sx={{fontSize:'100px'}}/> : <ThumbDownOffAltIcon sx={{fontSize:'100px'}}/>}
                    </div>
                </div>
                <label className='review__label'>Note:</label>
                <TextField
                    variant='outlined'
                    type='text'
                    placeholder='Enter Note'
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className='review__input'
                    multiline
                    rows={12}
                >
                </TextField>
                <br></br>
                <div className='review__button'>
                    <Button variant='contained' type='submit' sx={buttonOffMid} className='review__button__submit-button'><p className='review__button__submit-button__text'>Submit</p></Button>
                    <Link className='review__button__cancel-link' href={{
                        pathname: '/dashboard',
                        query: {
                            appointmentId: appointmentId,
                        }
                    }}>
                        <Button variant='contained' sx={buttonWhite} className='review__button__cancel-button'><p className='review__button__cancel-button__text'>Cancel</p></Button>
                    </Link>
                </div>
            </Box>

        </Paper>
    );
}