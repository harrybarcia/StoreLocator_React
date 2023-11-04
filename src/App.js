import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {useState, useEffect} from 'react';
import MapData from './components/MainHeader/map';
import Child from './components/parent';
import Welcome from './pages/Welcome';
import AllStores from './pages/Stores';
import AllStores2 from './pages/Stores2';
import AllPollens from './pages/Pollens';
import MainHeader from './components/MainHeader/MainHeader';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Users from './pages/Users';
import StarRating from './components/StarRating';
import AdminPanel from './pages/AdminPanel'
import './App.css';
import { minify } from "terser";

import Store from './pages/Store';
import NewStoreForm from './pages/NewStoreForm';
import NewPollenForm from './pages/NewPollenForm';
import EditStore from './pages/EditStore';
import Pollen from './components/pollen';
import EditPollen from './pages/EditPollen';
import Cluster from './components/cluster';
import AuthContext from './contexts/auth-context';
import Navigation from './components/MainHeader/Navigation';

const App = () => {

	return (
		<div className='main'>
			{/* all the child components are wrapped in the AuthContext.Provider and have access to the isLoggedIn, onLogout, and onLogin functions */}
			
				< MainHeader />
				<Routes>
					<Route path="/" element={<MapData />} />
					<Route path="/welcome"  element={<Welcome />} />
					<Route path="/all-stores" element={<MapData />} />
					<Route path="/api/:id" element={<Store />} />
					<Route path="/pollen/:id" element={<Pollen />} />
					<Route path="/add-store" element={<NewStoreForm />} />
					<Route path="/edit-store/:id" element={<EditStore />} />
					<Route path="/login" element={<Login />}/>
					<Route path="/logout" element={<Navigation />} />
					<Route path="/register" element={<Register />} /> 
					<Route path="/api/users" element={<Users />} />
					<Route path="/stores2" element={<AllStores2 />} />
					<Route path="/pollens" element={<Pollen />} />
					<Route path="/all-pollens" element={<AllPollens />} />
					<Route path="/add-pollen" element={<NewPollenForm />} />
					<Route path="/update-pollen/:id" element={<EditPollen />} />
					<Route path="/cluster" element={<Cluster />} />
					<Route path="/api/search" element={<AllStores />} />
					<Route path="/get-fields" element={<AdminPanel />} />
					<Route path="/rate/:id" element={<StarRating />} />

				</Routes>
			
		</div>
	);
}
export default App;