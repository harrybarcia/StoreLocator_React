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
          <header className="bg-gray-800 px-4 py-2 flex items-center justify-between ">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 ">
              <div className="container flex flex-wrap items-center justify-between mx-auto">
              <div className="flex-shrink-0 text-white text-xl">
                    <li><Link to="/">Welcome</Link></li>
              </div>
                <div className="hidden md:block">
                  <ul className="text-white text-xl">
                    <li><Link to="/all-stores">Stores</Link></li>
                    <li><Link to="/add-store">Add a new store</Link></li>
                    <li><Link to="/api/users">Users</Link></li>
                    <li><Link to="/stores2">Stores with Auth</Link></li>
                    <li><Link to="/pollens">Pollen</Link></li>
                    <li><Link to="/all-pollens">All Pollens</Link></li>
                    <li><Link to="/add-pollen">Add a new pollen</Link></li>
                    <li><Link to="/cluster">Cluster</Link></li>
                  </ul>
                  <ul className="text-white text-xl">
                    {!context.isLoggedIn && (<li><Link to="/login">Login</Link></li>)}
                  {!context.isLoggedIn && (<li><Link to="/register">Sign up</Link></li>)}
                  </ul>
                  <Navigation />
                </div>
                <div className="-mr-2 flex md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
              </div>
            </div>
            <div className={`${isMenuOpen ? "flex-col" : "hidden"} md:hidden`}>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <ul className="text-white text-xl flex-col max-w-max">
                
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
              </div>
            </div>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default MainHeader;
