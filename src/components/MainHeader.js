import React from "react";
import { Link } from "react-router-dom";
import './MainHeader.css';


const MainHeader = () => {
    return (
        <header>
            <ul className="banner">
                <li>
                    <Link to="/welcome">Welcome</Link>
                </li>
                <li>
                    <Link to="/products">Products</Link>
                </li>
                <li>
                    <Link to="/new-store">Add a new store</Link>
                </li>
                <li>
                    <Link to="/edit-store">Add a new store</Link>
                </li>


            </ul>
        </header>
    );
};

export default MainHeader;