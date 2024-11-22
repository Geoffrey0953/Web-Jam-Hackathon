import React, { useState, useEffect, useRef } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import SearchBar from "../components/SearchBar.jsx";
import Logo from "../assets/logo.svg";
import Settings from "../components/Settings.jsx";
import RefreshButton from "../components/Refresh.jsx";

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [places, setPlaces] = useState([]);
  const uciCenter = { lat: 33.6405, lng: -117.8443 };
  const [userLocation, setUserLocation] = useState(uciCenter); // Default location is UCI

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  async function updateUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation(uciCenter);
        }
      );
    }
  }

  useEffect(() => {
    updateUserLocation();
  }, []);

  useEffect(() => {
    console.log("hai");
    fetchNearbyRestaurants();
  }, [userLocation]);

  const fetchNearbyRestaurants = async () => {
    const body = {
      includedTypes: ["restaurant", "cafe"],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: userLocation.lat,
            longitude: userLocation.lng,
          },
          radius: 50000,
        },
      },
    };

    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:searchNearby",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": "places.displayName,places.location",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched places:", data);
        setPlaces(data.places || []);
      } else {
        const errorDetails = await response.json().catch(() => ({
          error: "Invalid JSON response",
        }));
        console.error(
          "Error fetching nearby places:",
          response.status,
          errorDetails
        );
      }
    } catch (error) {
      console.error("Error in fetchNearbyRestaurants:", error.message);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-50"></div>

      <div className="flex flex-row justify-between absolute w-full mt-4">
        <SearchBar toggleSettings={toggleSettings} />
        <img src={Logo} alt="logo" className="z-40 m-4" />
      </div>

      {/* <APIProvider apiKey={port.meta.env.VITE_GOOGLE_MAPS_API_KEYim}> */}
      <APIProvider apiKey="AIzaSyDsEGZgrOkbNKUQaT_2OuMbBqNL5gjO1iI">
        <Map
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={userLocation}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={true}
          options={{
            draggableCursor: "default",
            draggingCursor: "grabbing",
          }}
          mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
        >
          {places.map((place, index) => (
            <AdvancedMarker
              key={index}
              position={{
                lat: place.location.latitude,
                lng: place.location.longitude,
              }}
            />
          ))}
          <div className="z-[1000] absolute left-16 top-16">
            <RefreshButton callback={setUserLocation} />
          </div>
        </Map>
      </APIProvider>

      {showSettings && (
        <div className="absolute inset-0 bg-black/50 z-40"></div>
      )}

      <div
        className={`absolute top-0 left-0 z-50 transition-transform duration-500 ${
          showSettings ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Settings toggleSettings={toggleSettings} />
      </div>
    </div>
  );
};

export default Home;
