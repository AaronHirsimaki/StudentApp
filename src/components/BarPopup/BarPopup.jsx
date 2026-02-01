import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../StarRating/StarRating"
import { fetchBarRatings, calculateAverageRating, upsertRating } from "../../utils/ratings";
import "./BarPopup.css";

export default function BarPopup({ bar, position, onClose, map }) {
  const popupRef = useRef();
  const navigate = useNavigate();
  const [showRating, setShowRating] = useState(false);
  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    if (!map || !popupRef.current) return;

    const point = map.latLngToContainerPoint(position);
    const offsetX = 0;
    const offSetY = -50;
    popupRef.current.style.left = `${point.x + offsetX}px`;
    popupRef.current.style.top = `${point.y + offSetY}px`;
  }, [position, map]);

  useEffect(() => {
    async function loadRatings() {
      const reviews = await fetchBarRatings(bar.id);
      setRatingCount(reviews.length);
      setAverageRating(calculateAverageRating(reviews));
    }

    loadRatings();
  }, [bar.id]);


  const { name, "addr:street": street, "addr:housenumber": number } = bar.properties;

  return (
    <div className="bar-popup-container" ref={popupRef}>
      <div className="bar-popup-card">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>{name || "Nimetön baari"}</h3>
        <p>{street} {number}</p>

        <div className="bar-rating">
          {ratingCount === 0 ? (
            <span>No ratings yet</span>
          ) : (
            <>
              <span className="stars">⭐ {averageRating} / 5</span>
              <span className="count">({ratingCount} reviews)</span>
            </>
          )}
        </div>

        {!showRating && (
          <>
            <button
              className="popup-button"
              onClick={() => setShowRating(true)}
            >
              Give Rating
            </button>

            <button
              className="popup-button"
              onClick={() => {
                navigate(`/bar/${encodeURIComponent(bar.properties["@id"])}`);
                onClose();
              }}
            >
              More Info
            </button>
          </>
        )}

        {showRating && (
          <div className="rating-section">
            <StarRating
              onRatingSelect={async (rating) => {
                try {
                  await upsertRating({
                    barId: bar.id,
                    rating,
                  });

                  const reviews = await fetchBarRatings(bar.id);
                  setRatingCount(reviews.length);
                  setAverageRating(calculateAverageRating(reviews));

                  setShowRating(false);
                } catch (error) {
                  console.error("Rating failed:", error.message);
                  alert("You must be logged in to rate");
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
