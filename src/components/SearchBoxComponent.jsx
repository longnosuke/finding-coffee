import React from "react";
import { SearchBox } from "@mapbox/search-js-react";

const SearchBoxComponent = ({
  accessToken,
  mapRef,
  searchValue,
  setSearchValue,
}) => (
  <div className="searchbox">
    <SearchBox
      accessToken={accessToken}
      map={mapRef.current}
      value={searchValue}
      onChange={(selected) => setSearchValue(selected)}
      options={{ country: "VN" }}
      marker
    />
  </div>
);

export default SearchBoxComponent;
