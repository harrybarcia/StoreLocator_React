import React from "react";
import { Link } from "react-router-dom";
import './MainHeader.css';


const MainHeader = () => {
    return (
        <header>
            <ul className="banner">
                <li>
                    <Link to="/">Welcome</Link>
                </li>
                <li>
                    <Link to="/stores">Stores</Link>
                </li>
                <li>
                    <Link to="/add-store">Add a new store</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/logout">Logout</Link>
                </li>
                <li>
                    <Link to="/register">Sign up</Link>
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
        </header>
    );
};

export default MainHeader;