import React, { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import SearchBar from '../components/SearchBar.jsx';
import Logo from '../assets/logo.svg';
import Settings from '../components/Settings.jsx';

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);

  // Default fallback location: UCI
  const uciCenter = { lat: 33.6405, lng: -117.8443 };

  const [userLocation, setUserLocation] = useState(uciCenter); // Default location is UCI

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
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
          console.error('Error getting user location:', error);
          // Fall back to UCI
          setUserLocation(uciCenter);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Fall back to UCI
      setUserLocation(uciCenter);
    }
  }, []);

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-50"></div>

      <div className="flex flex-row justify-between absolute w-full mt-4">
        <SearchBar toggleSettings={toggleSettings} />
        <img src={Logo} alt="logo" className="z-40 m-4" />
      </div>

      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={userLocation} // Use user's location or UCI fallback
          defaultZoom={15} // Higher value for a zoomed-in map
          gestureHandling="greedy"
          disableDefaultUI={true}
          options={{
            draggableCursor: 'default',
            draggingCursor: 'grabbing',
            restriction: {
              latLngBounds: {
                north: 33.9519,
                south: 33.4657,
                west: -118.1251,
                east: -117.5191,
              },
            },
          }}
        />
      </APIProvider>

      {/* Dimmed Background */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 z-40"></div>
      )}

      {/* Settings Transition */}
      <div
        className={`absolute top-0 left-0 z-50 transition-transform duration-500 ${
          showSettings ? 'translate-x-0' : '-translate-x-full'
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
