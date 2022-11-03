import React from "react";
import { Link } from "react-router-dom";

const Logout = () => {
    return (
        <div>
            <h1>Logout</h1>
            <Link to="/login">Login</Link>
        </div>
    );
};

export default Logout;