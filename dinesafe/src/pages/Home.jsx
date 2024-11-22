import React, { useState, useEffect } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import SearchBar from "../components/SearchBar.jsx";
import Logo from "../assets/logo.svg";
import Settings from "../components/Settings.jsx";
import PlaceInfo from "../components/PlaceInfo.jsx"; // Import PlaceInfo component

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);

  // Default fallback location: UCI
  const uciCenter = { lat: 33.6405, lng: -117.8443 };

  const [userLocation, setUserLocation] = useState(uciCenter); // Default location is UCI
  const [restaurants, setRestaurants] = useState([]); // State to store restaurant data
  const [selectedPlace, setSelectedPlace] = useState(null); // State for the currently selected place

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  const generateGeocodingURL = (address, city) => {
    const APIKEY = "AIzaSyDsEGZgrOkbNKUQaT_2OuMbBqNL5gjO1iI"; // Comment out later
    const fullAddress = `${address}, ${city}`;
    const URLSafeAddress = encodeURIComponent(fullAddress);

    return `https://maps.googleapis.com/maps/api/geocode/json?address=${URLSafeAddress}&key=${APIKEY}`;
  };

  const fetchGeocodingData = async (address, city) => {
    try {
      const url = generateGeocodingURL(address, city);
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const result = data.results[0];
        const location = result.geometry.location;
        return location;
      }
    } catch (error) {
      console.error("Error fetching geocoding data", error);
    }
  };

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Fall back to UCI
          setUserLocation(uciCenter);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fall back to UCI
      setUserLocation(uciCenter);
    }
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/restaurants");
        const data = await response.json();

        const transformedData = await Promise.all(
          data.map(async (restaurant) => {
            const location = await fetchGeocodingData(
              restaurant.address,
              restaurant.city
            );
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

  const handleMarkerClick = (restaurant) => {
    setSelectedPlace(restaurant);
  };

  const closePlaceInfo = () => {
    setSelectedPlace(null);
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-50"></div>

      <div className="flex flex-row justify-between absolute w-full mt-4">
        <SearchBar toggleSettings={toggleSettings} />
        <img src={Logo} alt="logo" className="z-40 m-4" />
      </div>

      <APIProvider apiKey="AIzaSyDsEGZgrOkbNKUQaT_2OuMbBqNL5gjO1iI">
        <Map
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={userLocation}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI={true}
          options={{
            mapId: "316a6a241f019b2a",
            draggableCursor: "default",
            draggingCursor: "grabbing",
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
          {/* Add a marker for each restaurant */}
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
              title={restaurant.name}
              onClick={() => handleMarkerClick(restaurant)} // Handle marker click
            />
          ))}
        </Map>
      </APIProvider>

      {/* PlaceInfo Component */}
      {selectedPlace && (
        <div className="">
          <PlaceInfo place={selectedPlace} onClose={closePlaceInfo} />
        </div>
      )}

      {/* Dimmed Background */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 z-40"></div>
      )}

      {/* Settings Transition */}
      <div
        className={`absolute top-0 left-0 z-50 transition-transform duration-500 ${
          showSettings ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <Settings toggleSettings={toggleSettings} />
        </div>
      </div>
    </div>
  );
};

export default Home;