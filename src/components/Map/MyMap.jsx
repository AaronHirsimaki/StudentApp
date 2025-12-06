import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./myMap.css";
import barsData from "../../data/bars.json";
import BarPopup from "../BarPopup/BarPopup";

export default function MyMap({ setVisibleBars }) {

  const mapRef = useRef();
  const [selectedBar, setSelectedBar] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);


  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([60.1695, 24.9354], 18);
    mapRef.current = map;
    L
      .tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        //minZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
      .addTo(map);
    
    const filterBarsByBounds = (bounds) => {
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
    
      const filtered = barsData.features.filter((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        return (
          lat >= southWest.lat &&
          lat <= northEast.lat &&
          lng >= southWest.lng &&
          lng <= northEast.lng
        );
      });
    
      setVisibleBars(filtered);
    };


    const beerIcon = L.icon({
      iconUrl: "/images/beer4.png",
      iconSize: [60, 60],
      iconAnchor: [25, 50],
      popupAnchor: [0, -30]
    });

    L
      .geoJSON(barsData, {
        pointToLayer: (feature, latlng) => L.marker(latlng, { icon: beerIcon }),
        onEachFeature: (feature, layer) => {
          layer.on("click", (event) => {
            setSelectedBar(feature);
            setPopupPosition(event.latlng);
          });
        },
      }).addTo(map);
    filterBarsByBounds(map.getBounds());


    const closePopupHandler = () => {
      setSelectedBar(null);
      setPopupPosition(null);
    };

    map.on("movestart", closePopupHandler);
    map.on("zoomstart", closePopupHandler);
    map.on("dragstart", closePopupHandler);
    map.on("click", closePopupHandler);      // halutessasi click sulkee myös
    map.on("touchstart", closePopupHandler); // mobiilikosketus
    map.on("moveend", () => {
      filterBarsByBounds(map.getBounds());
    });


    return () => {
      // Poistetaan eventit ennen map.remove, jotta ei jää roikkuvia kuulijoita
      map.off("movestart", closePopupHandler);
      map.off("zoomstart", closePopupHandler);
      map.off("dragstart", closePopupHandler);
      map.off("click", closePopupHandler);
      map.off("touchstart", closePopupHandler);

      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <>
      <div id="map"></div>
      {selectedBar && popupPosition && (
        <BarPopup
          bar={selectedBar}
          position={popupPosition}
          onClose={() => setSelectedBar(null)}
          map={mapRef.current}
        />
      )}
    </>
  );

}
