import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {useState, useEffect} from 'react';
import MapData from './components/map';
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
import './App.css';


import Store from './pages/Store';
import NewStoreForm from './pages/NewStoreForm';
import NewPollenForm from './pages/NewPollenForm';
import EditStore from './pages/EditStore';
import Pollen from './components/pollen';
import EditPollen from './pages/EditPollen';
import Cluster from './components/cluster';
import AuthContext from './contexts/auth-context';

const App = () => {

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const loginHandler = (email, password) => {


		localStorage.setItem('isLoggedIn', '1');
		setIsLoggedIn(true);
	};
	const logoutHandler = () => {
		localStorage.removeItem('isLoggedIn');
		setIsLoggedIn(false);
	};

	return (
		<div className='main'>
			{/* all the child components are wrapped in the AuthContext.Provider and have access to the isLoggedIn, onLogout, and onLogin functions */}
			<AuthContext.Provider value={{isLoggedIn: isLoggedIn}}>
				< MainHeader />
				<Routes>
					<Route path="/" element={<MapData />} />
					<Route path="/welcome"  element={<Welcome />} />
					<Route path="/all-stores" element={<AllStores />} />
					<Route path="/api/:id" element={<Store />} />
					<Route path="/pollen/:id" element={<Pollen />} />
					<Route path="/add-store" element={<NewStoreForm />} />
					<Route path="/edit-store/:id" element={<EditStore />} />
					<Route path="/login" element={!isLoggedIn && <Login onLogin={loginHandler} />}/>
					<Route path="/logout" element={isLoggedIn && <Logout onLogout={logoutHandler}/>} />
					<Route path="/register" element={<Register />} /> 
					<Route path="/api/users" element={<Users />} />
					<Route path="/stores2" element={<AllStores2 />} />
					<Route path="/pollens" element={<Pollen />} />
					<Route path="/all-pollens" element={<AllPollens />} />
					<Route path="/add-pollen" element={<NewPollenForm />} />
					<Route path="/update-pollen/:id" element={<EditPollen />} />
					<Route path="/cluster" element={<Cluster />} />
					<Route path="/api/search" element={<AllStores />} />
					<Route path="/rate/:id" element={<StarRating />} />
				</Routes>
			</AuthContext.Provider>
		</div>
	);
}
export default App;