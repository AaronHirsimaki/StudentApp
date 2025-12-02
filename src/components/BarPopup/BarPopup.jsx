import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../StarRating/StarRating"
import "./BarPopup.css";

export default function BarPopup({ bar, position, onClose, map }) {
  const popupRef = useRef();
  const navigate = useNavigate();
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    if (!map || !popupRef.current) return;

    const point = map.latLngToContainerPoint(position);
    const offsetX = 0;
    const offSetY = -50;
    popupRef.current.style.left = `${point.x + offsetX}px`;
    popupRef.current.style.top = `${point.y + offSetY}px`;
  }, [position, map]);

  const { name, "addr:street": street, "addr:housenumber": number } = bar.properties;

  return (
    <div className="bar-popup-container" ref={popupRef}>
      <div className="bar-popup-card">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>{name || "Nimetön baari"}</h3>
        <p>{street} {number}</p>
        <p>Rating in stars 0-5</p>
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
              onRatingSelect={(rating) => {
                console.log(`⭐ Käyttäjä antoi ${rating} tähteä baarille ${name}`);
                // Tässä voisit lähettää tiedon backendille esim. fetchilla.
                setShowRating(false);
                onClose(); // sulkee popupin arvion jälkeen
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
