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
    <div>
        <div className="flex flex-row justify-between">
            <button
            className="h-12 bg-white w-52 rounded-full font-museo text-xl m-4 flex flex-row justify-center items-center"
            onClick={() => (window.location.href = "/")}
            >
            <img src={Left} className="mr-4"></img>
            Back to Map
            </button>
            <img src={Logo} alt="DineSafe Logo" className="w-72 p-8" />
        </div>

        <h1 className="text-6xl font-museo text-[#1E5AFF] text-center font-semibold">OUR TEAM</h1>
      
      <div className="flex justify-evenly mt-32">
        <div className="flex justify-center items-center flex-col w-72">
            <img src={Kelly} className="w-48"></img>
            <p className="font-museo text-2xl font-semibold">Kelly Serafico</p>
            <p className="font-museo text-xl font-regular text-[#414A62]">Software Engineering</p>
            <p className="font-museo text-xl font-light text-center">UI Design and Fullstack Implementation</p>
            <p className="font-museo text-xl font-regular text-[#1E5AFF]">serafick@uci.edu</p>
        </div>
        <div className="flex justify-center items-center flex-col w-72">
            <img src={Anthony} className="w-48"></img>
            <p className="font-museo text-2xl font-semibold ">Anthony Suh</p>
            <p className="font-museo text-xl font-regular text-[#414A62]">Computer Science</p>
            <p className="font-museo text-xl font-light text-center">Database and Fullstack Implementation</p>
            <p className="font-museo text-xl font-regular text-[#1E5AFF]">anthod1@uci.edu</p>
        </div>
        <div className="flex justify-center items-center flex-col w-72">
            <img src={Geoffrey} className="w-48"></img>
            <p className="font-museo text-2xl font-semibold">Geoffrey Lee</p>
            <p className="font-museo text-xl font-regular text-[#414A62]">Software Engineering</p>
            <p className="font-museo text-xl font-light text-center">Fullstack Implementation</p>
            <p className="font-museo text-xl font-regular text-[#1E5AFF]">geoffrl1@uci.edu</p>
        </div>
        <div className="flex justify-center items-center flex-col w-72">
            <img src={Andy} className="w-48"></img>
            <p className="font-museo text-2xl font-semibold">Andy Choi</p>
            <p className="font-museo text-xl font-regular text-[#414A62]">Computer Science</p>
            <p className="font-museo text-xl font-light text-center">Fullstack Implementation</p>
            <p className="font-museo text-xl font-regular text-[#1E5AFF]">andywc@uci.edu</p>
        </div>
      </div>
      
      </div>
  );
};

export default Contact;
