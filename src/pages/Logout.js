import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Logout = () => {

    const [logout, setLogout] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchLogout = async () => {
            // console.log("fetching");
            const response = await fetch("http://localhost:3000/logout");
            const data = await response.json();
            setLogout(data);
        }
        fetchLogout();
        navigate("/");

}, []);


    return (
        <div>
            <h1>Logout</h1>
            <Link to="/login">Login</Link>
        </div>
    );
};

export default Logout;