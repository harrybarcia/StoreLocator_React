import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {useState} from 'react';
import MapData from './components/map';
import Child from './components/parent';
import Welcome from './pages/Welcome';
import AllStores from './pages/Stores';
import AllStores2 from './pages/Stores2';
import MainHeader from './components/MainHeader';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Users from './pages/Users';
import './App.css';
import csvtojson from 'csvtojson';

import Store from './pages/Store';
import NewStoreForm from './pages/NewStoreForm';
import NewPollenForm from './pages/NewPollenForm';
import EditStore from './pages/EditStore';
import Pollen from './components/pollen';
import axios from 'axios';

const App = () => {

		const [file, setFile] = useState(null);
		const fileReader = new FileReader();
		
		const handleOnChange = (e) => {
			setFile(e.target.files[0]);
		};

		const handleOnSubmit = (e) => {
			e.preventDefault();
			if (file) {
				fileReader.onload = function (e) {
					const csvOutput = e.target.result;
					console.log(csvOutput);
					csvtojson()
						.fromString(csvOutput)
						.then((jsonOutput) => {
							axios.post('http://localhost:3001/add-pollen', jsonOutput);
							
							;
						});
					

						
				};
				fileReader.readAsText(file);

				}
			};
		

		return (
			<div className='main'>

			
				< MainHeader />
				    
				<Routes>
					<Route path="/" element={<MapData />} />
					<Route path="/welcome"  element={<Welcome />} />
					<Route path="/stores" element={<AllStores />} />
					<Route path="/api/:id" element={<Store />} />
					<Route path="/add-store" element={<NewStoreForm />} />
					<Route path="/edit-store/:id" element={<EditStore />} />
					<Route path="/login" element={<Login />} />
					<Route path="/logout" element={<Logout />} />
					<Route path="/register" element={<Register />} /> 
					<Route path="/api/users" element={<Users />} />
					<Route path="/stores2" element={<AllStores2 />} />
					<Route path="/pollens" element={<Pollen />} />
					<Route path="/add-pollen" element={<NewPollenForm />} />
				</Routes>

				<div style={{ textAlign: "center" }}>
					<h1>REACTJS CSV IMPORT EXAMPLE </h1>
					<form>
						<input
							type={"file"}
							id={"csvFileInput"}
							accept={".csv"}
							onChange={handleOnChange}
						/>

						<button
							onClick={(e) => {
								handleOnSubmit(e);
							}}
						>
							IMPORT CSV
						</button>


					</form>
				</div>
			</div>
		);
		
  
}

export default App;

// our-domain.com/new-meetup => NewMeetupPage
// our-domain.com/meetups => AllMeetupsPage