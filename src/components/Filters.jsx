import React, { useState } from "react";

const Filters = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState("Highland");

  const filterOptions = [
    { label: "Highland Coffee", value: "Highland" },
    { label: "Starbucks", value: "Starbuck" },
    { label: "Cafe MyLife", value: "Mylife" },
    { label: "Cà Phê Phúc Long", value: "Phúc Long" },
    { label: "The Coffee House", value: "Coffee House" },
  ];

  const handleFilterClick = (value) => {
    setSelectedFilter(value);
    onFilterChange(value); // Call immediately, no debounce needed here
  };

  return (
    <div className="filters">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilterClick(option.value)}
          className={option.value === selectedFilter ? "active" : ""}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Filters;
