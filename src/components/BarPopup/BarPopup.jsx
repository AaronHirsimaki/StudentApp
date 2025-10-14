import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./BarPopup.css";

export default function BarPopup({ bar, position, onClose, map }) {
  const popupRef = useRef();
  const navigate = useNavigate();

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
        <button className="popup-more-button"
          onClick={() => {
            navigate(`/bar/${encodeURIComponent(bar.properties["@id"])}`);
            onClose();
          }}
        >
          More info
        </button>
      </div>
    </div>
  );
}
