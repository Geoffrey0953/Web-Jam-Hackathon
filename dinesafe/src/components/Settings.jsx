import { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";
import Cancel from "../assets/cancel.svg";

const Settings = ({ toggleSettings, onMapIdChange }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  useEffect(() => {
    onMapIdChange(isToggled); // Update parent state whenever isToggled changes
  }, [isToggled, onMapIdChange]);

  return (
    <div className="bg-white h-screen w-80 p-4 flex flex-col">
      <div className="flex flex-row justify-between">
        <img src={Logo} alt="logo" className="z-40 w-36" />
        <button onClick={toggleSettings}>
          <img
            src={Cancel}
            alt="cancel"
            className="w-6 h-6 m-4 cursor-pointer"
          />
        </button>
      </div>

      <h1>Settings</h1>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="mr-4">Dark Mode</span>
          <div
            className={`relative w-12 h-6 ${
              isToggled ? "bg-green-500" : "bg-gray-300"
            } rounded-full cursor-pointer transition-colors`}
            onClick={handleToggle}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                isToggled ? "translate-x-6" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
