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
                    <Link to="/new-store">Add a new store</Link>
                </li>
                


            </ul>
        </header>
    );
};

export default MainHeader;