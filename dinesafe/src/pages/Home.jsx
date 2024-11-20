import React, { useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import SearchBar from '../components/SearchBar.jsx';
import Logo from '../assets/logo.svg';
import Settings from '../components/Settings.jsx';

const Home = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

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
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          defaultZoom={3}
          gestureHandling="greedy"
          disableDefaultUI={true}
          options={{
            draggableCursor: 'default',
            draggingCursor: 'grabbing',
            types: ['restaurant'],
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
        <div className="">
          <Settings toggleSettings={toggleSettings} />
        </div>
      </div>
    </div>
  );
};

export default Home;