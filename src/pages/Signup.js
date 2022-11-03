import React from "react";
import { Link } from "react-router-dom";


const Signup = () => {
    return (
        <div>
            <h1>Signup</h1>
            <form>
                <label>
                    Email
                    <input type="email" />
                </label>
                <label>
                    Password
                    <input type="password" />
                </label>
                <label>
                    Confirm Password
                    <input type="password" />
                </label>
                <button type="submit">Signup</button>
            </form>
            <Link to="/login">Login</Link>
        </div>
    );
};

export default Signup;