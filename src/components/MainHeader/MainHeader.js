import React from "react";
import { Link } from "react-router-dom";
import "./MainHeader.css";
import { useState } from "react";
import AuthContext from "../../contexts/auth-context";
import Navigation from "./Navigation";

const MainHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="bg-gray-800 px-4 py-2 flex items-center  ">

            <div className="flex ">
            <p className="border  text-white border-solid text-center hidden md:block">Display</p>

            <button type="submit" className="my-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>

              <div className="text-white">03</div>
            </div>
            {/* <div className="hidden sm:block px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <ul className=" text-white text-xl flex-col max-w-max sm:flex-row sm:space-x-4">
                <li><Link to="/all-stores">Stores</Link></li>
                <li><Link to="/add-store">Add a new store</Link></li>
                <li><Link to="/api/users">Users</Link></li>
                <li><Link to="/stores2">Stores with Auth</Link></li>
                <li><Link to="/pollens">Pollen</Link></li>
                <li><Link to="/all-pollens">All Pollens</Link></li>
                <li><Link to="/add-pollen">Add a new pollen</Link></li>
                <li><Link to="/cluster">Cluster</Link></li>
                {!context.isLoggedIn && (<li><Link to="/login">Login</Link></li>)}
                {!context.isLoggedIn && (<li><Link to="/register">Sign up</Link></li>)}
              </ul>
            </div> */}

          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default MainHeader;
