import { useState } from "react";
import "./StarRating.css";

export default function StarRating({ maxStars = 5, onRatingSelect }) {
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedStar, setSelectedStar] = useState(0);

    const handleClick = (rating) => {
        setSelectedStar(rating);
        if (onRatingSelect) {
            onRatingSelect(rating);
        }
    };

    return (
        <div className="star-rating-container">
            <div className="star-rating">
                {[...Array(maxStars)].map((_, index) => {
                    const starNumber = index + 1;
                    const isFilled = starNumber <= (hoveredStar || selectedStar);

                    return (
                        <button
                            key={starNumber}
                            className={`star ${isFilled ? "filled" : ""}`}
                            onMouseEnter={() => setHoveredStar(starNumber)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => handleClick(starNumber)}
                        >
                            ★
                        </button>
                    );
                })}
            </div>
            <button>Confirm</button>
        </div>
    );
}