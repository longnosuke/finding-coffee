import React from "react";

const Statistics = ({ center, zoom }) => (
  <div className="statistic">
    Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom:{" "}
    {zoom.toFixed(2)}
  </div>
);

export default Statistics;
