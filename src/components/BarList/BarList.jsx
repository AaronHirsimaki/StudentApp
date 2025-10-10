import { Link } from "react-router-dom";
import barsData from "../../data/bars.json";
import "./BarList.css"

export default function BarList() {

    return (
        <div className="barlist">
            <ul>
                {barsData.features.map((feature) => {
                    const id = encodeURIComponent(feature.properties["@id"]);
                    const name = feature.properties.name || "Nimetön Baari";

                    // Haetaan osoitetiedot hakasulkeilla
                    const street = feature.properties["addr:street"] || "";
                    const houseNumber = feature.properties["addr:housenumber"] || "";
                    const postcode = feature.properties["addr:postcode"] || "";

                    // Rakennetaan osoiterivi nätisti yhteen
                    const address = [street, houseNumber, postcode]
                        .filter(Boolean) // poistaa tyhjät kohdat
                        .join(" ");

                    return (
                        <li key={id} className="barlist-item">
                            <div className="barlist-info">
                                <strong className="barlist-name">{name}</strong>
                                {address && <span className="bar-address"> - {address}</span>}
                            </div>
                            <Link to={`/bar/${id}`} className="barlist-button">
                                More
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}