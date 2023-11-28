'use client';

// MODULES IMPORT
import React, { useState } from 'react';

export default function Rating() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    // const handleClick = (value) => {
    //     setRating(value);
    // };

    //innstall react-star-ratings - npm
    //react-star-rating-component - npm
 
    return (
        <div>
            <h1>Rating</h1>
            <div>
            <h1>Rating</h1>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value="0">Select Rating...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <p>The rating is: {rating}</p>
            <button>Submit</button>
            </div>
        </div>
    );
}