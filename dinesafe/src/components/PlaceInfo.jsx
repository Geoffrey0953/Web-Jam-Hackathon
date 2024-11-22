import React from "react";
import FillerPic from "../assets/FillerPic.jpg";

const PlaceInfo = ({ place, onClose }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <div className="absolute top-0 left-0 w-[528px] bg-white h-screen font-josefin">
      <img
        src={FillerPic}
        alt="restaurant"
        className="w-full h-80 object-cover"
      />
      <div className="w-full border-b-2 border-gray-300">
        <p className="text-3xl">Place Name</p>
        <p className="text-base text-[#5C5C5C]">Place Type</p>
        <p className="text-base">Place Description</p>
        <p
          className="text-base text-[#1E5AFF] cursor-pointer"
          onClick={() => copyToClipboard("Place Address")}
        >
          Place Address
        </p>
      </div>
    </div>
  );
};

export default PlaceInfo;
