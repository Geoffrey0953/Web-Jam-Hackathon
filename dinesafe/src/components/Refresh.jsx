import { useMap } from "@vis.gl/react-google-maps";
import React from "react";

const RefreshButton = ({ callback }) => {
  const map = useMap();

  const handleClick = () => {
    if (map) {
      console.log(map);
      const center = map.getCenter();
      const lat = center.lat();
      const lng = center.lng();
      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      callback({ lat, lng });
    }
  };

  return <button onClick={handleClick}> Refresh</button>;
};

export default RefreshButton;
