import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './contexts/auth-context';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<AuthContextProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</AuthContextProvider>
);
