import React, { useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = accessToken;

const Listings = ({ locations, loading, mapRef, markers }) => {
  const handleListingClick = (location) => {
    mapRef.current.flyTo({
      center: [location.lng, location.lat],
      zoom: 16,
    });

    const marker = markers.find(
      (m) =>
        m.getLngLat().lng === location.lng && m.getLngLat().lat === location.lat
    );

    if (marker) marker.togglePopup();
  };

  return (
    <div id="listings" className="listings">
      {loading ? (
        <div>Loading locations...</div>
      ) : (
        locations.map((location, index) => (
          <div
            key={index}
            className="listing"
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
