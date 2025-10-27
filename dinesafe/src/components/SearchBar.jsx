import React, { useState } from "react";
import Menu from "../assets/menu.svg";
import PlaceInfo from "./PlaceInfo";

const SearchBar = ({ onLocationSelect, toggleSettings, onSearch, showMenuIcon = true }) => {
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
					`https://web-jam-hackathon-back.vercel.app/api/search-restaurants?query=${encodeURIComponent(query)}`
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
		<div className="relative w-full bg-white z-10 rounded-full h-12 sm:h-14 flex shadow-lg">
			{/* Menu Icon triggers toggleSettings */}
			{selectedPlace && (
				<PlaceInfo
					place={selectedPlace}
					onClose={() => {
						setSelectedPlace(null);
					}}
				/>
			)}
			{showMenuIcon && (
				<img
					src={Menu}
					alt="menu"
					className="w-5 h-5 sm:w-6 sm:h-6 m-2 sm:m-4 cursor-pointer flex-shrink-0"
					onClick={toggleSettings}
				/>
			)}
			<input
				className="flex-1 outline-none px-3 sm:px-4 text-sm sm:text-base min-w-0 bg-transparent"
				type="text"
				placeholder="Search restaurants..."
				value={searchQuery}
				onChange={handleInputChange}
			/>

			{/* Display search results below the search bar */}
			{searchResults.length > 0 && (
				<ul className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg w-full overflow-y-auto max-h-60 sm:max-h-96 z-50">
					{searchResults.map((restaurant) => (
						<li
							key={restaurant._id}
							className="p-3 sm:p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
							onClick={() => {
								// Set the selected place and clear the search results
								setSearchQuery("");
								setSearchResults([]);
								setSelectedPlace(restaurant);
								onLocationSelect(restaurant.lat, restaurant.lng);
							}}
						>
							{restaurant.name ? restaurant.name.replace(/\^+$/, "").trim() : restaurant.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SearchBar;
