import React, {useContext, useEffect} from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navigation.module.css';
import { Link } from 'react-router-dom';
import Login from '../../pages/Login';
import AuthContext from '../../contexts/auth-context';

const Navigation = () => {
    const [logout, setLogout] = useState([]);
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const handleSubmit = (e) => {
        e.preventDefault();
        const fetchLogout = async () => {
            
            // console.log("fetching");
            const response = await fetch("/logout");
            const data = await response.json();
            console.log("data", data);
            setLogout(data);
        }
        fetchLogout();
        authCtx.onLogout();
        navigate("/");
    }
    
  
  return (
    
      <nav className="nav">
        <ul className="text-white text-xl">
          {authCtx.isLoggedIn && (
            <li>
              <button onClick= {handleSubmit}
              >Logout</button>
            </li>
          )}
        </ul>
      </nav>
    );
};

export default Navigation;
