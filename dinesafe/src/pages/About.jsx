import React from "react";
import AboutImg from "../assets/about.svg";
import Logo from "../assets/logo.svg";
import Left from "../assets/left.svg";
import Right from "../assets/right.svg";
import { useNavigate } from "react-router-dom";
const About = () => {
  return (
    <div>
      <button
        className="absolute h-12 bg-white w-52 rounded-full font-museo text-xl m-4 flex flex-row justify-center items-center"
        onClick={() => (window.location.href = "/")}
      >
        <img src={Left} className="mr-4"></img>
        Back to Map
      </button>
      <div className="flex justify-center items-center">
        <p className="absolute text text-center text-white t-0 text-6xl font-museo">
          dine happy, dine safe.
        </p>
        <img src={AboutImg} alt="About" className="w-full h-80 object-cover" />
      </div>
      {/* Content Section */}
      <div className="flex flex-col items-center text-center font-josefin text-2xl">
        <img src={Logo} alt="DineSafe Logo" className="w-72 p-8" />
        <p className="w-[950px] p-4">
          DineSafe is a platform dedicated to promoting food safety and public
          health by spreading awareness of unsanitary food practices in
          restaurants across Orange County. Our mission is to foster a safer and
          healthier dining environment for everyone in the community.
        </p>
        <p className="w-[950px]">
          By acting as a bridge between everyday consumers and local
          establishments, DineSafe empowers diners to make informed choices
          while encouraging restaurants to adopt and maintain higher hygiene
          standards. We aim to create a positive impact on the food industry and
          help everyday eaters feel confident about where they dine.
        </p>

        {/* Contact Us Button */}
        <button className="mt-16 bg-[#1E5AFF] text-white w-60 px-4 py-2 rounded-full font-museo flex items-center justify-center " onClick={() => (window.location.href = "/contact")}>
          Contact Us!
          <img src={Right} alt="Forward Icon" className="ml-4 w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default About;
