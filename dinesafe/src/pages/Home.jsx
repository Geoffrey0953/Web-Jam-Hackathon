import React, { useState, useEffect } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import SearchBar from "../components/SearchBar.jsx";
import Logo from "../assets/logo.svg";
import LogoDark from "../assets/logo-dark.svg";
import Menu from "../assets/menu.svg";
import Settings from "../components/Settings.jsx";
import PlaceInfo from "../components/PlaceInfo.jsx";

const Home = () => {
	const [showSettings, setShowSettings] = useState(false);
	const [mapID, setMapId] = useState("316a6a241f019b2a");
	const [isDarkMode, setIsDarkMode] = useState(false);

	const uciCenter = { lat: 33.6405, lng: -117.8443 };
	const [userLocation, setUserLocation] = useState(uciCenter);
	const [restaurants, setRestaurants] = useState([]);
	const [inspectedRestaurants, setInspectedRestaurants] = useState([]);
	const [selectedPlace, setSelectedPlace] = useState(null);

	const toggleSettings = () => setShowSettings((prev) => !prev);

	const handleMapIdChange = (isDarkMode) => {
		setMapId(isDarkMode ? "e96f8c91ebd2e899" : "316a6a241f019b2a");
		setIsDarkMode(isDarkMode);
		localStorage.setItem("darkMode", isDarkMode);
	};

	const handleLocationSelect = (lat, lng) => {
		console.log(userLocation);
		setUserLocation({ lat, lng });
		console.log(userLocation);
	};

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				() => setUserLocation(uciCenter)
			);
		}
	}, []);

	useEffect(() => {
		const storedDarkMode = localStorage.getItem("darkMode") === "true";
		setMapId(storedDarkMode ? "e96f8c91ebd2e899" : "316a6a241f019b2a");
		setIsDarkMode(storedDarkMode);
	}, []);

	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				const response = await fetch("https://web-jam-hackathon-back.vercel.app/api/restaurants");
				const data = await response.json();

				const transformedData = await Promise.all(
					data.map(async (restaurant) => {
						const location = await fetchGeocodingData(restaurant.address, restaurant.city);
						return {
							id: restaurant._id,
							name: restaurant.establishment_name,
							address: restaurant.address,
							city: restaurant.city,
							reason: restaurant.reason_for_closure,
							latitude: location.lat,
							longitude: location.lng,
						};
					})
				);

				setRestaurants(transformedData);
			} catch (error) {
				console.error("Error fetching restaurants:", error);
			}
		};
		fetchRestaurants();
	}, []);

	useEffect(() => {
		const fetch300Restaurants = async () => {
			try {
				const response = await fetch("https://web-jam-hackathon-back.vercel.app/api/300restaurants");
				const data = await response.json();

				setInspectedRestaurants(
					data.map((inspectedRestaurant) => ({
						id: inspectedRestaurant._id,
						name: inspectedRestaurant.name,
						address: inspectedRestaurant.address,
						summary: inspectedRestaurant.summary,
						pdfURL: inspectedRestaurant.pdfUrl,
						categories: inspectedRestaurant.categories,
						lat: inspectedRestaurant.location.lat,
						lng: inspectedRestaurant.location.lng,
						imported_at: inspectedRestaurant.imported_at,
					}))
				);
			} catch (error) {
				console.error("Error fetching inspected restaurants:", error);
			}
		};

		fetch300Restaurants();
	}, []);

	// Use the IDs from the restaurants given by our two functions

	const fetchGeocodingData = async (address, city) => {
		try {
			const APIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
			const fullAddress = encodeURIComponent(`${address}, ${city}`);
			const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&key=${APIKEY}`;
			const response = await fetch(url);
			const data = await response.json();

			if (data.status === "OK") {
				return data.results[0].geometry.location;
			}
		} catch (error) {
			console.error("Error fetching geocoding data", error);
		}
	};

	// Search bar functionality

	const fetchRestaurantsByQuery = async (query) => {
		try {
			const response = await fetch(`https://web-jam-hackathon-back.vercel.app/api/restaurants?query=${query}`);
			const data = await response.json();

			setRestaurants(
				data.map((restaurant) => ({
					id: restaurant._id,
					name: restaurant.establishment_name,
					address: restaurant.address,
					city: restaurant.city,
					latitude: restaurant.latitude,
					longitude: restaurant.longitude,
				}))
			);
		} catch (error) {
			console.error("Error searching restaurants:", error);
		}
	};

	const fetchInspectedRestaurantsByQuery = async (query) => {
		try {
			const response = await fetch(`https://web-jam-hackathon-back.vercel.app/api/300restaurants?query=${query}`);
			const data = await response.json();

			setInspectedRestaurants(
				data.map((restaurant) => ({
					id: restaurant._id,
					name: restaurant.name,
					address: restaurant.address.replace(/\s+(?:Suite|Ste|#)\s+\S+/i, ""),
					lat: restaurant.location.lat,
					lng: restaurant.location.lng,
				}))
			);
		} catch (error) {
			console.error("Error searching inspected restaurants:", error);
		}
	};

	const handleSearch = (query) => {
		fetchRestaurantsByQuery(query);
		fetchInspectedRestaurantsByQuery(query);
	};

	// // Places API picture right here :D
	// In Home.jsx or a separate API service filefw

	return (
		<div className="relative">
			<div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-50"></div>
			{/* Mobile: Stacked layout, Desktop: Horizontal layout */}
			<div className="absolute w-full mt-3 sm:mt-4 px-3 sm:px-4 z-50">
				{/* Mobile Layout - Stacked */}
				<div className="block sm:hidden">
					<div className="flex flex-col space-y-3">
						{/* Top row: Logo and Menu */}
						<div className="flex justify-between items-center px-1">
							<img src={isDarkMode ? LogoDark : Logo} alt="logo" className="h-7 flex-shrink-0" />
							<div className="p-2 rounded-full bg-white/90 shadow-sm">
								<img src={Menu} alt="menu" className="w-5 h-5 cursor-pointer" onClick={toggleSettings} />
							</div>
						</div>
						{/* Bottom row: Search bar */}
						<div className="w-full px-1">
							<SearchBar
								onLocationSelect={handleLocationSelect}
								toggleSettings={toggleSettings}
								onSearch={handleSearch}
								showMenuIcon={false}
							/>
						</div>
					</div>
				</div>

				{/* Desktop Layout - Horizontal */}
				<div className="hidden sm:flex flex-row justify-between items-center">
					<div className="w-96 max-w-md">
						<SearchBar onLocationSelect={handleLocationSelect} toggleSettings={toggleSettings} onSearch={handleSearch} />
					</div>
					<img src={isDarkMode ? LogoDark : Logo} alt="logo" className="z-40 h-8 md:h-auto flex-shrink-0" />
				</div>
			</div>

			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
				<Map
					key={mapID} // Ensures Map remounts when mapID changes
					style={{ width: "100vw", height: "100vh" }}
					defaultCenter={userLocation}
					defaultZoom={15}
					gestureHandling="greedy"
					disableDefaultUI={true}
					options={{
						mapId: mapID,
						draggableCursor: "default",
						restriction: {
							latLngBounds: {
								north: 33.9519,
								south: 33.4657,
								west: -118.1251,
								east: -117.5191,
							},
						},
					}}
				>
					{/* // Original restaurants */}
					{restaurants.map((restaurant) => (
						<Marker
							key={restaurant.id}
							position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
							title={restaurant.name}
							onClick={() => setSelectedPlace(restaurant)} // Set selectedPlace to restaurant data
							icon={{
								url:
									selectedPlace?.id === restaurant.id
										? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Highlighted marker
										: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Default marker
							}}
						/>
					))}

					{inspectedRestaurants.map((inspectedRestaurant) => (
						<Marker
							key={inspectedRestaurant._id}
							position={{
								lat: inspectedRestaurant.lat,
								lng: inspectedRestaurant.lng,
							}}
							title={inspectedRestaurant.name}
							icon={{
								url:
									selectedPlace?.id === inspectedRestaurant.id
										? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Highlighted marker
										: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png", // Default marker
							}}
							onClick={() => setSelectedPlace(inspectedRestaurant)} // Set selectedPlace to inspectedRestaurant data
						/>
					))}
				</Map>
			</APIProvider>

			{selectedPlace && <PlaceInfo place={selectedPlace} onClose={() => setSelectedPlace(null)} />}

			{showSettings && <div className="absolute inset-0 bg-black/50 z-40"></div>}

			<div
				className={`absolute top-0 left-0 z-50 transition-transform duration-500 ${
					showSettings ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<Settings toggleSettings={toggleSettings} onMapIdChange={handleMapIdChange} />
			</div>
		</div>
	);
};

export default Home;
