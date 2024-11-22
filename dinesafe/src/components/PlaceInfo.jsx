import React from "react";
import FillerPic from "../assets/FillerPic.jpg";
import Cancel from "../assets/cancel.svg";

const PlaceInfo = ({ place, onClose }) => {
  console.log(place);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Address copied to clipboard!");
    });
  };

  // Format the address
  const formattedAddress = `${place?.address || "Unknown Address"}, ${
    place?.city || "Unknown City"
  }, CA`;

  return (
    <div className="absolute top-0 left-0 w-[528px] bg-white h-screen font-josefin">
      <img
        src={FillerPic}
        alt="restaurant"
        className="w-full h-80 object-cover"
      />
      <div className="w-full border-b-2 border-gray-300 p-4">
        {/* Cancel Button */}
        <button
          className="absolute top-7 right-6 bg-white rounded-full w-8 h-8 flex justify-center items-center cursor-pointer"
          onClick={onClose}
        >
          <img src={Cancel} alt="cancel" className="w-4 h-4" />
        </button>

        {/* Place Information */}
        <p className="text-3xl normal-case">{place?.name || "Place Name"}</p>
        <p className="text-base text-[#5C5C5C]">
          {place?.reason || "No Reason Provided"}
        </p>
        <p className="text-base text-gray-700">
          <span
            className="text-[#1E5AFF] cursor-pointer"
            onClick={() => copyToClipboard(formattedAddress)}
          >
            {formattedAddress}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PlaceInfo;
