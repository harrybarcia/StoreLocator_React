import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/auth-context";

const Logout = () => {

    const [logout, setLogout] = useState([]);
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    
    useEffect(() => {
        const fetchLogout = async () => {
            alert("here")
            // console.log("fetching");
            const response = await fetch("/logout");
            const data = await response.json();
            console.log("data", data);
            setLogout(data);

        }
        fetchLogout();
        navigate("/");
        authCtx.onLogout();
    }, []);


    return (
        <div>
            <h1>Logout</h1>
            <Link to="/login">Login</Link>
        </div>
    );
};

export default Logout;