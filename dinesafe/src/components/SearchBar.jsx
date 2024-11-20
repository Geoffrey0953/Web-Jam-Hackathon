import React from 'react';
import Menu from "../assets/menu.svg";

const SearchBar = ({ toggleSettings }) => {
  return (
    <div className="w-96 bg-white z-40 rounded-full h-14 flex ml-4 shadow-lg">
      {/* Menu Icon triggers toggleSettings */}
      <img
        src={Menu}
        alt="menu"
        className="w-6 h-6 m-4 cursor-pointer"
        onClick={toggleSettings}
      />
      <input
        className="w-9/12 outline-none px-2"
        type="text"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchBar;
