import React, { useState, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import * as turf from "@turf/turf";

const accessToken =
  "pk.eyJ1IjoidGhhbmhsb25nbm9zdWtlIiwiYSI6ImNtNHV6bzZwejAwM2cyam9pbmU4anFuOG0ifQ.Od7m9cqqZIxozu8N13VhTA";
mapboxgl.accessToken = accessToken;

const Listings = ({ locations, loading, mapRef, markers }) => {
  const [activeLocation, setActiveLocation] = useState(null);
  const [distances, setDistances] = useState([]);
  const [isAscending, setIsAscending] = useState(true);

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
        const newPopup = new mapboxgl.Popup()
          .setHTML(`<p><strong>${location.name}</strong></p>
          <p>${location.address}</p>
          <p><strong>Wi-Fi:</strong> ${location.wifi}</p>
          <p><strong>House Number:</strong> ${location.house_number}</p>`);
        marker.setPopup(newPopup);
        newPopup.addTo(mapRef.current);
      }
    }
    setActiveLocation(location);
  };

  const calculateDistances = (userLat, userLng) => {
    const calculatedDistances = locations.map((location) => {
      const from = turf.point([userLng, userLat]);
      const to = turf.point([location.lng, location.lat]);
      const distance = turf.distance(from, to, { units: "kilometers" });
      return { location, distance };
    });
    setDistances(calculatedDistances);
  };

  const sortDistances = (ascending) => {
    const sortedDistances = [...distances].sort((a, b) =>
      ascending ? a.distance - b.distance : b.distance - a.distance
    );
    setDistances(sortedDistances);
    setIsAscending(ascending);
  };

  useEffect(() => {
    if (navigator.geolocation && locations.length > 0) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        calculateDistances(userLat, userLng);
      });
    }
  }, [locations]);

  const CustomScript = useCallback(
    (lng, lat) => {
      const existingControls = mapRef.current._controls || [];
      existingControls.forEach((control) => {
        if (control instanceof MapboxDirections) {
          mapRef.current.removeControl(control);
        }
      });
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/cycling",
      });

      mapRef.current.addControl(directions, "top-left");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          directions.setOrigin([userLng, userLat]);
          directions.setDestination([lng, lat]);
        });
      }
    },
    [mapRef]
  );

  return (
    <div id="listings" className="listings">
      {loading ? (
        <div>Loading locations...</div>
      ) : (
        <>
          <div className="sorting-buttons">
            <button
              className="button-primary"
              onClick={() => sortDistances(true)}
            >
              Distance ↓
            </button>
            <button
              className="button-primary"
              onClick={() => sortDistances(false)}
            >
              Distance ↑
            </button>
          </div>
          {distances.map((dist, index) => {
            const location = dist.location;
            return (
              <div
                key={index}
                className={`listing ${
                  activeLocation === location ? "active" : ""
                }`}
                onClick={() => handleListingClick(location)}
              >
                <h2>{location.name}</h2>
                <p>
                  <strong>Wi-Fi:</strong>
                  {location.wifi}
                </p>
                <p>
                  <strong>House Number:</strong>
                  {location.house_number}
                </p>
                <p>
                  <strong>Address:</strong>
                  {location.address}
                </p>
                <p>
                  <strong>Distance:</strong>
                  <span>{dist.distance.toFixed(2)} km</span>
                </p>
                <button
                  className="getdirection-listings button-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    CustomScript(location.lng, location.lat);
                  }}
                >
                  Get Directions
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Listings;
