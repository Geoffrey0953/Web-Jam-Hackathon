import React, { useState, useEffect } from "react";
import FillerPic from "../assets/download.jpg";
import Cancel from "../assets/cancel.svg";
import Go from "../assets/go.svg";

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
					name: place.name || "",
					address: place.address ? (place.city ? `${place.address}, ${place.city}, CA` : place.address) : "",
				});

				const response = await fetch(`https://web-jam-hackathon-back.vercel.app/api/place-photo?${params}`);

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
		<>
			{/* Mobile backdrop */}
			<div
				className={`fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity duration-300 ${
					isExiting ? "opacity-0" : "opacity-100"
				}`}
				onClick={handleClose}
			/>

			<div
				className={`absolute bg-white font-josefin transform transition-all duration-300 z-50 ease-in-out overflow-y-auto scrollbar-hide sm:overflow-y-auto ${
					isExiting ? "translate-x-full opacity-0 sm:translate-x-full" : "translate-x-0 opacity-100 sm:translate-x-0"
				} ${
					// Mobile: Bottom sheet, Desktop: Sidebar
					"bottom-0 left-0 right-0 h-3/4 sm:h-screen sm:w-[528px] sm:ml-8 sm:right-auto"
				}`}
				style={{
					boxShadow: "0 0 15px rgba(0,0,0,0.1)",
					animation: "slideInMobile 0.3s ease-out",
				}}
			>
				<style>
					{`
          /* Hide scrollbar on mobile */
          .scrollbar-hide {
            -ms-overflow-style: none;  /* Internet Explorer 10+ */
            scrollbar-width: none;  /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar { 
            display: none;  /* Safari and Chrome */
          }
          
          @keyframes slideInMobile {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @media (min-width: 640px) {
            @keyframes slideInMobile {
              from {
                transform: translateX(-100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          }
        `}
				</style>
				<img src={placePhoto} alt="restaurant" className="w-full h-48 sm:h-80 object-cover" />
				<div className="w-full border-b-2 border-gray-300 p-4">
					{/* Cancel Button */}
					<button
						className="absolute top-7 right-6 bg-white rounded-full w-8 h-8 flex justify-center items-center cursor-pointer transform transition-all duration-200 hover:scale-110 hover:bg-gray-50"
						onClick={handleClose}
					>
						<img src={Cancel} alt="cancel" className="w-4 h-4" />
					</button>

					{/* Place Information */}
					<p className="text-xl sm:text-3xl normal-case">{place?.name ? place.name.replace(/\^+$/, "").trim() : "Place Name"}</p>
					<p className="text-sm sm:text-base text-gray-700">
						<span
							className="text-[#1E5AFF] cursor-pointer hover:underline transition-all duration-200"
							onClick={() => copyToClipboard(formattedAddress)}
						>
							{formattedAddress}
						</span>
					</p>
				</div>
				{place?.categories && Object.values(place.categories).some((value) => value) && (
					<>
						<p className="m-4 text-lg sm:text-xl">Recent Violations</p>
					</>
				)}

				<div className="text-sm sm:text-base text-[#B62D2D] ml-4 sm:ml-8">
					<span className="font-bold">
						{place?.reason ? (
							<ul className="list-disc list-inside">
								<li>{place.reason}</li>
							</ul>
						) : place?.categories ? (
							<ul className="list-disc list-inside">
								{Object.entries(place.categories)
									.filter(([_, value]) => value)
									.map(([key]) => (
										<li key={key}>{key}</li>
									))}
							</ul>
						) : (
							"No Information Available"
						)}
					</span>
				</div>
				{place?.summary && (
					<div className="text-sm sm:text-base text-gray-700 mt-4 mb-4 px-4 leading-relaxed flex items-center flex-col">
						<span>{place.summary}</span>
						{place?.pdfURL && (
							<button className="rounded border-2 border-[#1E5AFF] flex mt-4 p-2 text-sm sm:text-base">
								<a
									href={place.pdfURL}
									target="_blank"
									rel="noopener noreferrer"
									className="block text-[#1E5AFF] hover:underline transition-all duration-200"
								>
									View Inspection Report
								</a>
								<img src={Go} />
							</button>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default PlaceInfo;
