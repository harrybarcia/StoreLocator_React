import React from "react";
import { Link } from "react-router-dom";
import './MainHeader.css';
import {useState} from 'react';
import AuthContext from "../../contexts/auth-context";
import Navigation from "./Navigation";


const MainHeader = () => {

    
    return (
        <AuthContext.Consumer>
            {(
                context => {
                    return (
                        <header className="bg-gray-800 px-4 py-2 flex items-center justify-between ">
                            <ul className="text-white text-xl">
                                <li className="white">
                                    <Link to="/">Welcome</Link>
                                </li>
                                <li>
                                    <Link to="/all-stores">Stores</Link>
                                </li>
                                <li>
                                    <Link to="/add-store">Add a new store</Link>
                                </li>
                                <li>
                                    <Link to="/api/users">Users</Link>
                                </li>
                                <li>
                                    <Link to="/stores2">Stores with Auth</Link>
                                </li>
                                <li>
                                    <Link to="/pollens">Pollen</Link>
                                </li>
                                <li>
                                    <Link to="/all-pollens">All Pollens</Link>
                                </li>

                                <li>
                                    <Link to="/add-pollen">Add a new pollen</Link>
                                </li>
                                <li>
                                    <Link to="/cluster">Cluster</Link>
                                </li>
                            </ul>
                            <ul className="text-white text-xl">
                                {!context.isLoggedIn && (
                                <li>
                                    <Link 
                                    to="/login">Login</Link>
                                </li>
                                )}
                                
                                {!context.isLoggedIn && (
                                <li>
                                    <Link to="/register">Sign up</Link>
                                </li>
                                )}
                                
                            </ul>
                            <Navigation />
                        </header>
                    )
                }
            )}
       
        </AuthContext.Consumer>
    );
};

export default MainHeader;