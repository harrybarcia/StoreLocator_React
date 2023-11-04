import React, { createContext, useEffect, useState } from "react";
import Logout from "../pages/Logout";

const AuthContext = createContext(
    
    {
        isLoggedIn: false,
        onLogout: () => { },
        onLogin: () => { },
    }

);
export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
        if (storedUserLoggedInInformation === "1") {
            setIsLoggedIn(true);
        }
    }, []);
    const logoutHandler = () => {
        
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        
    };

    const loginHandler = () => {
        localStorage.setItem("isLoggedIn", "1");
        setIsLoggedIn(true);
    };
    const contextValue = {
        isLoggedIn: localStorage.getItem("isLoggedIn") === "1",
        onLogout: logoutHandler,
        onLogin: loginHandler,
    };
    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};


export default AuthContext;