import React, { useState } from "react";
import Menu from "../assets/menu.svg";
import PlaceInfo from "./PlaceInfo";

const SearchBar = ({ onLocationSelect, toggleSettings, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSearch, setShowSearch] = useState(true);


  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    if (query.trim()) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/search-restaurants?query=${encodeURIComponent(query)}`
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]); // Clear results on error
      }
    } else {
      setSearchResults([]); // Clear results when query is empty
    }
  };
  
  return (
    <div className="relative w-96 bg-white z-10 rounded-full h-14 flex ml-4 shadow-lg">
      {/* Menu Icon triggers toggleSettings */}
      {selectedPlace && (
        <PlaceInfo 
          place={selectedPlace}
          onClose={() => {
            setSelectedPlace(null);
          }}
        />
      )}
      <img
          src={Menu}
          alt="menu"
          className="w-6 h-6 m-4 cursor-pointer"
          onClick={toggleSettings}
          />
          <input
            className="w-9/12 outline-none px-2"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
          />
      
      
      {/* Display search results below the search bar */}
      {searchResults.length > 0 && (
        <ul
          className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg w-full overflow-y-auto max-h-96"
          style={{ zIndex: 1000 }} // Ensures it appears above other content
        >
          {searchResults.map((restaurant) => (
            <li
              key={restaurant._id}
              className="p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                // Set the selected place and clear the search results
                setSearchQuery("");
                setSearchResults([]);
                setSelectedPlace(restaurant);
                onLocationSelect(restaurant.lat, restaurant.lng);
              }}
            >
              {restaurant.name ? restaurant.name.replace(/\^+$/, '').trim() : restaurant.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
