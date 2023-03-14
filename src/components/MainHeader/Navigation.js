import React, {useContext} from 'react';

import './Navigation.module.css';
import { Link } from 'react-router-dom';
import Login from '../../pages/Login';
import AuthContext from '../../contexts/auth-context';

const Navigation = () => {
  const ctx = useContext(AuthContext);
  return (
    
      <nav className="nav">
        <ul>
          {ctx.isLoggedIn && (
            <li>
              <button onClick={
                ctx.onLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    );
};

export default Navigation;
