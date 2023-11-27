'use client';
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
            {[...Array(5)].map((star, index) => {
                const ratingValue = (index + 1) * 2;
                return (
                    <label key={index}>
                        <input 
                            type="radio" 
                            name="rating" 
                            value={ratingValue} 
                            // onClick={() => handleClick(ratingValue)}
                        />
                        <span 
                            className="star"
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                            style={{ color: hover >= ratingValue || rating >= ratingValue ? "gold" : "lightgray" }}
                        >
                            &#9733;
                        </span>
                    </label>
                );
            })}
            <p>The rating is: {rating / 5}</p>
            <button>Submit</button>
        </div>
    );
}