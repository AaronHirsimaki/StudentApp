import barsData from "../../data/bars.json";
import { useParams } from "react-router-dom";
import "./BarPage.css";
import BackButton from "../../components/BackButton/BackButton";
import defaultBarImage from "../../images/1.png";

export default function BarPage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);

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
        <p>Rating here</p>
        <div className="comment-button">
          <button>comment</button>
        </div>
        <p>Comments coming soon</p>
      </div>
    </div>
  );
}
