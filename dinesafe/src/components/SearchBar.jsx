import React from 'react';
import Menu from "../assets/menu.svg";
const SearchBar = () => {
  return (
    <div className="w-96 bg-white z-40 rounded-full h-14 flex ml-4 shadow-lg">
        <img src={Menu} alt="menu" className="w-6 h-6 m-4 float-left" />
        <input className="" type="text" placeholder="Search..." />
    </div>
  );
}

export default SearchBar;