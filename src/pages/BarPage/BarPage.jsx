import barsData from "../../data/bars.json";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./BarPage.css";
import BackButton from "../../components/BackButton/BackButton";
import defaultBarImage from "../../images/1.png";
import { fetchBarRatings, calculateAverageRating } from "../../utils/ratings";

export default function BarPage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);

  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);

  const bar = barsData.features.find(
    (feature) => feature.properties["@id"] === decodedId,
  );

  if (!bar) {
    return <p>Bar not found</p>;
  }

  const props = bar.properties;

  const {
    name,
    "addr:street": street,
    "addr:housenumber": number,
    opening_hours,
  } = bar.properties;

  useEffect(() => {
    async function loadRatings() {
      const reviews = await fetchBarRatings(bar.id);
      setRatingCount(reviews.length);
      setAverageRating(calculateAverageRating(reviews));
    }

    loadRatings();
  }, [bar.id]);


  return (
    <div className="bar-page">
      <div className="bar-card">
        <BackButton label="Back to map" />
        <h1>{name || "bar name not found"}</h1>
        <div className="bar-info">
          <p>
            <strong>Address:</strong> {street || "We dont know lol"} {number}
          </p>
          {opening_hours && (
            <p>
              <strong>Open:</strong> {opening_hours}
            </p>
          )}
        </div>
        <div className="bar-rating">
          {ratingCount === 0 ? (
            <span>No ratings yet</span>
          ) : (
            <>
              <span className="stars">⭐ {averageRating} / 5</span>
              <span className="count"> ({ratingCount} reviews)</span>
            </>
          )}
        </div>
        <div className="comment-button">
          <button>comment</button>
        </div>
        <p>Comments coming soon</p>
      </div>
    </div>
  );
}
