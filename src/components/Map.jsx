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

        // Remove old markers and add new ones
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = filteredLocations.map((location) => {
          const marker = new mapboxgl.Marker()
            .setLngLat([location.lng, location.lat])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<h3>${location.name}</h3><p>${location.address}</p>`
              )
            )
            .addTo(mapRef.current);
          return marker;
        });
      });
  }, [filterValue, setLocations, setLoading]);

  return <div id="map-container" />;
};

export default Map;
