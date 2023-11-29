'use client';

// MODULES IMPORT
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ReviewCard() {
    // STATE VARIABLES
    const [reviewRating, setReviewRating] = useState<number | undefined>();
    const [reviewNote, setReviewNote] = useState<string>("");
    
    const router = useRouter();
    const ratingValue: number[] = [1, 2, 3, 4, 5];

    // SEARCH PARAMS
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');
    const role = searchParams.get('role');
    console.log(appointmentId);
    console.log(role);

    // HELPER FUNCTION
    async function submitReview() {
        const reviewData = {
            appointmentId: appointmentId,
            role: role,
            reviewRating: reviewRating,
            reviewNote: reviewNote,
        }

        const url: string = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/review`;
        await axios.post(url, reviewData);
        alert('Review submitted successfully!');
        router.push('/dashboard');
    };

 
    return (
        <form onSubmit={submitReview}>
            <h1>Review</h1>
            <div>
                <label>Rating</label>
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} required>
                <option disabled> -- Select Rating -- </option>
                    {ratingValue.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
                <p>The rating is: {reviewRating}</p>
                <label className='a'>Note:</label>
                <input
                    type='text'
                    placeholder='Enter Note'
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className='a'
                ></input>
                <button type='submit'>Submit</button>
            </div>
        </form>
    );
}