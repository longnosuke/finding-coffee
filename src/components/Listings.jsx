import React, { useState } from "react";
import mapboxgl from "mapbox-gl";
const accessToken =
  "pk.eyJ1IjoidGhhbmhsb25nbm9zdWtlIiwiYSI6ImNtNHV6bzZwejAwM2cyam9pbmU4anFuOG0ifQ.Od7m9cqqZIxozu8N13VhTA";
mapboxgl.accessToken = accessToken;

const Listings = ({ locations, loading, mapRef, markers }) => {
  const [activeLocation, setActiveLocation] = useState(null);
  const handleListingClick = (location) => {
    mapRef.current.flyTo({
      center: [location.lng, location.lat],
      zoom: 16,
    });

    const marker = markers.find(
      (m) =>
        m.getLngLat().lng.toFixed(6) === location.lng.toFixed(6) &&
        m.getLngLat().lat.toFixed(6) === location.lat.toFixed(6)
    );

    if (marker) {
      const popup = marker.getPopup();
      if (popup) {
        popup.isOpen() ? popup.remove() : popup.addTo(mapRef.current);
      } else {
        const newPopup = new mapboxgl.Popup().setHTML(
          `<p>${location.name}</p><p>${location.address}</p>`
        );
        marker.setPopup(newPopup);
        newPopup.addTo(mapRef.current);
      }
    }

    setActiveLocation(location);
  };

  return (
    <div id="listings" className="listings">
      {loading ? (
        <div>Loading locations...</div>
      ) : (
        locations.map((location, index) => (
          <div
            key={index}
            className={`listing ${activeLocation === location ? "active" : ""}`}
            onClick={() => handleListingClick(location)}
          >
            <h2>{location.name}</h2>
            <p>
              <strong>Wi-Fi:</strong> {location.wifi}
            </p>
            <p>
              <strong>House Number:</strong> {location.house_number}
            </p>
            <p>
              <strong>Address:</strong> {location.address}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Listings;
