import React, { useState, useEffect } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import SearchBar from "../components/SearchBar.jsx";
import Logo from "../assets/logo.svg";
import Settings from "../components/Settings.jsx";
import PlaceInfo from "../components/PlaceInfo.jsx";

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [mapID, setMapId] = useState("316a6a241f019b2a");

  const uciCenter = { lat: 33.6405, lng: -117.8443 };
  const [userLocation, setUserLocation] = useState(uciCenter);
  const [restaurants, setRestaurants] = useState([]);
  const [inspectedRestaurants, setInspectedRestaurants] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const toggleSettings = () => setShowSettings((prev) => !prev);

  const handleMapIdChange = (isDarkMode) => {
    setMapId(isDarkMode ? "e96f8c91ebd2e899" : "316a6a241f019b2a");
    localStorage.setItem("darkMode", isDarkMode);
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

  useEffect(() => {
    const fetch300Restaurants = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/300restaurants"
        );
        const data = await response.json();

        setInspectedRestaurants(
          data.map((inspectedRestaurant) => ({
            _id: inspectedRestaurant.id,
            name: inspectedRestaurant.name,
            address: inspectedRestaurant.address,
            summary: inspectedRestaurant.summary,
            pdfURL: inspectedRestaurant.pdfUrl,
            catergories: inspectedRestaurant.catergories,
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

  const fetchGeocodingData = async (address, city) => {
    try {
      const APIKEY = "AIzaSyDsEGZgrOkbNKUQaT_2OuMbBqNL5gjO1iI";
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

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-50"></div>
      <div className="flex flex-row justify-between absolute w-full mt-4">
        <SearchBar toggleSettings={toggleSettings} />
        <img src={Logo} alt="logo" className="z-40 m-4" />
      </div>

      <APIProvider apiKey="AIzaSyDsEGZgrOkbNKUQaT_2OuMbBqNL5gjO1iI">
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
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
              title={restaurant.name}
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
            />
          ))}
        </Map>
      </APIProvider>

      {selectedPlace && (
        <PlaceInfo
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {showSettings && (
        <div className="absolute inset-0 bg-black/50 z-40"></div>
      )}

      <div
        className={`absolute top-0 left-0 z-50 transition-transform duration-500 ${
          showSettings ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Settings
          toggleSettings={toggleSettings}
          onMapIdChange={handleMapIdChange}
        />
      </div>
    </div>
  );
};

export default Home;
