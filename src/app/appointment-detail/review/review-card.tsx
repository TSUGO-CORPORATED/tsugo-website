'use client';

// MODULES IMPORT
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReviewCard() {
    // STATE VARIABLES
    const [reviewThumb, setReviewThumb] = useState<boolean | undefined>();
    const [reviewNote, setReviewNote] = useState<string>("");
    
    const router = useRouter();

    // SEARCH PARAMS
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');
    const role = searchParams.get('role');
    console.log("ID",appointmentId);
    console.log("role",role);

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
    }, [reviewThumb])

    return (
        <>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Test</h1>
            <h1>Review</h1>
            <form onSubmit={submitReview}>
                {/* <label>Rating</label>
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} required>
                <option disabled> -- Select Rating -- </option>
                    {ratingValue.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
                <p>The rating is: {reviewRating}</p> */}
                <div>
                    <div onClick={() => setReviewThumb(true)}>Thumbs Up</div>
                    <div onClick={() => setReviewThumb(false)}>Thumbs Down</div>
                </div>
                <label className='a'>Note:</label>
                <input
                    type='text'
                    placeholder='Enter Note'
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className='a'
                ></input>
                <button type='submit' onClick={submitReview}>Submit</button>
            </form>
            <Link href={{
                pathname: '/appointment-detail',
                query: {
                    appointmentId: appointmentId,
                }
            }}>
                <button className='add_review_button'>Cancel</button>
            </Link>
        </>
    );
}