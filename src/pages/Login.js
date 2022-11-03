import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div>
            <h1>Login</h1>
            <form>
                <label>
                    Email
                    <input type="email" />
                </label>
                <label>
                    Password
                    <input type="password" />
                </label>
                <button type="submit">Login</button>
            </form>
            <Link to="/signup">Sign up</Link>
        </div>
    );
};


export default Login;