import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { SearchBox } from "@mapbox/search-js-react";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

const INITIAL_CENTER = [106.61804, 10.76901];
const INITIAL_ZOOM = 16;
const accessToken =
  "pk.eyJ1IjoidGhhbmhsb25nbm9zdWtlIiwiYSI6ImNtNHV6bzZwejAwM2cyam9pbmU4anFuOG0ifQ.Od7m9cqqZIxozu8N13VhTA";

function App() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
    });

    new mapboxgl.Marker().setLngLat(INITIAL_CENTER).addTo(mapRef.current);

    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      // Update state
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const handleSearchChange = (selected) => {
    setSearchValue(selected);

    if (selected?.coordinates) {
      const [lng, lat] = selected.coordinates;
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: INITIAL_ZOOM,
      });
    }
  };

  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
  };

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button>
      <div class="sidebar">
        <div class="heading">
          <h1>Our locations</h1>
        </div>
        <div id="listings" class="listings"></div>
      </div>
      <div>
        <SearchBox
          accessToken={accessToken}
          map={mapRef.current}
          mapboxgl={mapboxgl}
          value={searchValue}
          onChange={handleSearchChange}
          marker
        />
      </div>
      <div id="map-container" ref={mapContainerRef} />
    </>
  );
}

export default App;
