import React from 'react';

import './Navigation.module.css';
import AuthContext from '../../contexts/auth-context';

const Navigation = () => {
  
  return (
    <AuthContext.Consumer>
      {(ctx) => {
        
        return (
      <nav className="nav">
        <ul>
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Users</a>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Admin</a>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <button >Logout</button>
            </li>
          )}
        </ul>
      </nav>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default Navigation;
