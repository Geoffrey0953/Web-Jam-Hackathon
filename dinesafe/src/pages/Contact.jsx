import React from "react";
import AboutImg from "../assets/about.svg";
import Logo from "../assets/logo.svg";
import Left from "../assets/left.svg";
import Right from "../assets/right.svg";
import Kelly from "../assets/kelly.png";
import Anthony from "../assets/anthony.png";
import Geoffrey from "../assets/geoffrey.png";
import Andy from "../assets/andy.png";

import { useNavigate } from "react-router-dom";
const Contact = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row justify-between items-center p-4">
				<button
					className="h-10 sm:h-12 bg-white w-40 sm:w-52 rounded-full font-museo text-sm sm:text-xl m-2 sm:m-4 flex flex-row justify-center items-center shadow-lg order-2 sm:order-1"
					onClick={() => (window.location.href = "/")}
				>
					<img src={Left} className="mr-2 sm:mr-4 w-4 h-4 sm:w-5 sm:h-5" />
					Back to Map
				</button>
				<img src={Logo} alt="DineSafe Logo" className="w-48 sm:w-64 md:w-72 p-4 sm:p-8 order-1 sm:order-2" />
			</div>

			<h1 className="text-3xl sm:text-4xl md:text-6xl font-museo text-[#1E5AFF] text-center font-semibold px-4">OUR TEAM</h1>

			{/* Team Section */}
			<div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-8 sm:gap-4 mt-8 sm:mt-16 md:mt-32 px-4">
				<div className="flex justify-center items-center flex-col w-full sm:w-80 md:w-72">
					<img src={Kelly} className="w-32 sm:w-40 md:w-48 rounded-full" />
					<p className="font-museo text-lg sm:text-xl md:text-2xl font-semibold mt-4">Kelly Serafico</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-regular text-[#414A62]">Software Engineering</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-light text-center">
						UI Design and Fullstack Implementation
					</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-regular text-[#1E5AFF]">serafick@uci.edu</p>
				</div>
				<div className="flex justify-center items-center flex-col w-full sm:w-80 md:w-72">
					<img src={Anthony} className="w-32 sm:w-40 md:w-48 rounded-full" />
					<p className="font-museo text-lg sm:text-xl md:text-2xl font-semibold mt-4">Anthony Suh</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-regular text-[#414A62]">Computer Science</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-light text-center">
						Database and Fullstack Implementation
					</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-regular text-[#1E5AFF]">anthods1@uci.edu</p>
				</div>
				<div className="flex justify-center items-center flex-col w-full sm:w-80 md:w-72">
					<img src={Geoffrey} className="w-32 sm:w-40 md:w-48 rounded-full" />
					<p className="font-museo text-lg sm:text-xl md:text-2xl font-semibold mt-4">Geoffrey Lee</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-regular text-[#414A62]">Software Engineering</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-light text-center">Fullstack Implementation</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-regular text-[#1E5AFF]">geoffrl1@uci.edu</p>
				</div>
				<div className="flex justify-center items-center flex-col w-full sm:w-80 md:w-72">
					<img src={Andy} className="w-32 sm:w-40 md:w-48 rounded-full" />
					<p className="font-museo text-lg sm:text-xl md:text-2xl font-semibold mt-4">Andy Choi</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-regular text-[#414A62]">Computer Science</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-light text-center">Fullstack Implementation</p>
					<p className="font-museo text-sm sm:text-base md:text-xl font-regular text-[#1E5AFF]">andywc@uci.edu</p>
				</div>
			</div>
		</div>
	);
};

export default Contact;
