import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { parseTags } from "../utils/parseTags";

const Map = ({
  accessToken,
  mapRef,
  initialCenter,
  initialZoom,
  setCenter,
  setZoom,
  setLocations,
  filterValue,
  setLoading,
}) => {
  const markersRef = useRef([]);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    mapRef.current = new mapboxgl.Map({
      container: "map-container",
      center: initialCenter,
      zoom: initialZoom,
    });

    const nav = new mapboxgl.NavigationControl();
    mapRef.current.addControl(nav);

    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapRef.current.getZoom());
    });

    return () => mapRef.current.remove();
  }, [accessToken, initialCenter, initialZoom]);

  useEffect(() => {
    setLoading(true);
    fetch("/hcm-coffee-shops.json")
      .then((response) => response.json())
      .then((data) => {
        const filteredLocations = data.features
          .filter(
            (feature) =>
              feature.properties.name &&
              (filterValue === "*" ||
                feature.properties.name.includes(filterValue))
          )
          .map((feature) => {
            const tags = parseTags(feature.properties.other_tags || "");
            return {
              name: feature.properties.name,
              wifi: tags.wifi === "yes" ? "Available" : "Not available",
              house_number: tags["addr:housenumber"] || "Not available",
              street: tags["addr:street"] || "Not available",
              opening_hours: tags["opening_hours"] || "Not available",
              address: `${tags["addr:housenumber"] || ""} ${
                tags["addr:street"] || ""
              }`,
              lng: feature.geometry.coordinates[0],
              lat: feature.geometry.coordinates[1],
            };
          });

        setLocations(filteredLocations);
        setLoading(false);

        markersRef.current = filteredLocations.map((location) => {
          const markerButton = document.createElement("button");
          markerButton.className = "marker-button";
          markerButton.setAttribute("type", "button");

          const marker = new mapboxgl.Marker({ element: markerButton })
            .setLngLat([location.lng, location.lat])
            .addTo(mapRef.current);

          markerButton.addEventListener("click", () => {
            console.debug("FlyTo and Popup activated");

            mapRef.current.flyTo({
              center: [location.lng, location.lat],
              zoom: 14,
              speed: 1.2,
            });

            const popup = marker.getPopup();
            if (popup) {
              popup.isOpen() ? popup.remove() : popup.addTo(mapRef.current);
            } else {
              const newPopup = new mapboxgl.Popup().setHTML(
                `<p><strong>${location.name}</strong></p>
                 <p>${location.address}</p>
                 <p><strong>Wi-Fi:</strong> ${location.wifi}</p>
                 <p><strong>House Number:</strong> ${location.house_number}</p>`
              );
              marker.setPopup(newPopup);
              newPopup.addTo(mapRef.current);
            }
          });

          return marker;
        });
      });
  }, [filterValue, setLocations, setLoading]);

  return <div id="map-container" />;
};

export default Map;
