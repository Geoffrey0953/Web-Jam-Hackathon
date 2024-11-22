import React, { useState, useEffect } from "react";
import FillerPic from "../assets/grey.jpg";
import Cancel from "../assets/cancel.svg";

const PlaceInfo = ({ place, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [placePhoto, setPlacePhoto] = useState(FillerPic);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match this with animation duration
  };

  useEffect(() => {
    const getPhoto = async () => {
      try {
        if (!place?.name && !place?.address) {
          setPlacePhoto(FillerPic);
          return;
        }

        const params = new URLSearchParams({
          name: place.name || '',
          address: place.address ? (place.city ? `${place.address}, ${place.city}, CA` : place.address) : ''
        });

        const response = await fetch(
          `http://localhost:5000/api/place-photo?${params}`
        );
        
        if (!response.ok) {
          setPlacePhoto(FillerPic);
          return;
        }

        const data = await response.json();
        setPlacePhoto(data.photoUrl);

      } catch (error) {
        console.error("Error fetching place photo:", error);
        setPlacePhoto(FillerPic);
      }
    };

    getPhoto();
}, [place]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Address copied to clipboard!");
    });
  };

  const formattedAddress = place?.address 
    ? place.city 
      ? `${place.address}, ${place.city}, CA`
      : `${place.address}`
    : "Unknown Address, CA";


    

  return (
    <div 
      className={`absolute top-0 left-0 w-[528px] bg-white h-screen font-josefin transform transition-all duration-300 z-50 ease-in-out ${
        isExiting ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
      style={{
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        animation: "slideIn 0.3s ease-out"
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      {/* <img
        src={FillerPic}
        alt="restaurant"
        className="w-full h-80 object-cover"
      /> */}
      <img
        src={placePhoto}
        alt="restaurant"
        className="w-full h-80 object-cover"
      />
      <div className="w-full border-b-2 border-gray-300 p-4">
        {/* Cancel Button */}
        <button
          className="absolute top-7 right-6 bg-white rounded-full w-8 h-8 flex justify-center items-center cursor-pointer transform transition-all duration-200 hover:scale-110 hover:bg-gray-50"
          onClick={handleClose}
        >
          <img src={Cancel} alt="cancel" className="w-4 h-4" />
       </button>

       {/* Place Information */}
       <p className="text-3xl normal-case">
         {place?.name ? place.name.replace(/\^+$/, '').trim() : "Place Name"}
       </p>
       <p className="text-base text-[#5C5C5C]">
         <span className="font-bold">
           {place?.reason 
             ? place.reason 
             : place?.categories 
               ? Object.entries(place.categories)
                   .filter(([_, value]) => value)
                   .map(([key]) => key)
                   .join(", ") 
               : "No Information Available"
           }
          </span>
        </p>
        <p className="text-base text-gray-700">
          <span
            className="text-[#1E5AFF] cursor-pointer hover:underline transition-all duration-200"
            onClick={() => copyToClipboard(formattedAddress)}
          >
            {formattedAddress}
          </span>
        </p>
      </div>
      {place?.summary && (
        <p className="text-base text-gray-700 mt-4 mb-4 px-4 leading-relaxed text-center">
          {place.summary}
          {place?.pdfURL && (
            <a 
              href={place.pdfURL}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-[#1E5AFF] hover:underline transition-all duration-200"
            >
              View Inspection Report PDF
            </a>
          )}
        </p>
      )}
    </div>
  );
};

export default PlaceInfo;