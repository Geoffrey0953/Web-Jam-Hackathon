import React from "react";
import AboutImg from "../assets/about.svg";
import Logo from "../assets/logo.svg";
import Left from "../assets/left.svg";
import Right from "../assets/right.svg";
import { useNavigate } from "react-router-dom";
const About = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<button
				className="absolute h-10 sm:h-12 bg-white w-40 sm:w-52 rounded-full font-museo text-sm sm:text-xl m-2 sm:m-4 flex flex-row justify-center items-center shadow-lg z-10"
				onClick={() => (window.location.href = "/")}
			>
				<img src={Left} className="mr-2 sm:mr-4 w-4 h-4 sm:w-5 sm:h-5" />
				Back to Map
			</button>
			<div className="flex justify-center items-center relative">
				<p className="absolute text-center text-white z-10 text-2xl sm:text-4xl md:text-6xl font-museo px-4">
					dine happy, dine safe.
				</p>
				<img src={AboutImg} alt="About" className="w-full h-48 sm:h-64 md:h-80 object-cover" />
			</div>
			{/* Content Section */}
			<div className="flex flex-col items-center text-center font-josefin px-4 py-8">
				<img src={Logo} alt="DineSafe Logo" className="w-48 sm:w-64 md:w-72 p-4 sm:p-8" />
				<div className="max-w-4xl space-y-6">
					<p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
						DineSafe is a platform dedicated to promoting food safety and public health by spreading awareness of unsanitary food
						practices in restaurants across Orange County. Our mission is to foster a safer and healthier dining environment for
						everyone in the community.
					</p>
					<p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
						By acting as a bridge between everyday consumers and local establishments, DineSafe empowers diners to make informed
						choices while encouraging restaurants to adopt and maintain higher hygiene standards. We aim to create a positive
						impact on the food industry and help everyday eaters feel confident about where they dine.
					</p>
				</div>

				{/* Contact Us Button */}
				<button
					className="mt-8 sm:mt-12 md:mt-16 bg-[#1E5AFF] text-white w-48 sm:w-60 px-4 py-2 sm:py-3 rounded-full font-museo flex items-center justify-center text-sm sm:text-base"
					onClick={() => (window.location.href = "/contact")}
				>
					Contact Us!
					<img src={Right} alt="Forward Icon" className="ml-2 sm:ml-4 w-4 h-4 sm:w-6 sm:h-6" />
				</button>
			</div>
		</div>
	);
};

export default About;
