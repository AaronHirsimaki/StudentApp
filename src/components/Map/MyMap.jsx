import { useEffect, useRef } from "react";
import leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "./myMap.css";
import barsData from "../../data/bars.json";

export default function MyMap() {

    const mapRef = useRef();

    useEffect(() => {
        if (mapRef.current) return;

        const map = leaflet.map("map").setView([60.1695, 24.9354], 18);
        mapRef.current = map;

        leaflet
            .tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                //minZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
            .addTo(map);

        const beerEmojiIcon = leaflet.divIcon({
            html: "🍺",
            className: "emoji-icon",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
        });

        leaflet
            .geoJSON(barsData, {
                pointToLayer: (feature, latlng) => leaflet.marker(latlng, { icon: beerEmojiIcon }),
                onEachFeature: (feature, layer) => {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup(`
                            <div>
                                <b>${feature.properties.name}</b><br/>
                                <button>More info</button>
                            </div>
                            `);
                    }
                }
            })
            .addTo(map)

        return () => {
            map.remove();
            mapRef.current = null;
        }

    }, [])

    return <div id="map"></div>;
}