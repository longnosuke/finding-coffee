import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Map from "./components/Map";
import Statistics from "./components/Statistics";
import Filters from "./components/Filters";
import Listings from "./components/Listings";
import ResetButton from "./components/ResetButton";
import SearchBoxComponent from "./components/SearchBoxComponent";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

const INITIAL_CENTER = [106.61804, 10.76901];
const INITIAL_ZOOM = 16;
const accessToken =
  "pk.eyJ1IjoidGhhbmhsb25nbm9zdWtlIiwiYSI6ImNtNHV6bzZwejAwM2cyam9pbmU4anFuOG0ifQ.Od7m9cqqZIxozu8N13VhTA";

function App() {
  const mapRef = useRef();
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [searchValue, setSearchValue] = useState("");
  const [locations, setLocations] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("Highland");

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    markers.forEach((marker) => marker.remove());

    const newMarkers = locations.map((location) =>
      new mapboxgl.Marker()
        .setLngLat([location.lng, location.lat])
        .addTo(mapRef.current)
    );

    setMarkers(newMarkers);
  }, [locations]);

  const handleReset = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  return (
    <>
      <SearchBoxComponent
        accessToken={accessToken}
        mapRef={mapRef}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        className="searchbox"
      />
      <Statistics center={center} zoom={zoom} />
      <div className="sidebar-wrapper">
        <Filters onFilterChange={handleFilterChange} />
        <Listings
          locations={locations}
          mapRef={mapRef}
          markers={markers}
          loading={loading}
        />
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
        <div className="statistics">
          <h3>Statistics</h3>
        </div>
      </div>
      <Map
        accessToken={accessToken}
        mapRef={mapRef}
        initialCenter={INITIAL_CENTER}
        initialZoom={INITIAL_ZOOM}
        setCenter={setCenter}
        setZoom={setZoom}
        setLocations={setLocations}
        filterValue={filterValue}
        setLoading={setLoading}
      />
    </>
  );
}

export default App;
