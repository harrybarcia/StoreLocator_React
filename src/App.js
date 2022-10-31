import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MapData from './components/map';
import Child from './components/parent';
import Welcome from './pages/Welcome';
import AllStores from './pages/Stores';
import MainHeader from './components/MainHeader';
import './App.css';

import Store from './pages/Store';
import NewStoreForm from './pages/NewStoreForm';
import EditStore from './pages/EditStore';
const App = () => {

		return (
			<div className='main'>
				{/* me retourne la carte */}
				{/* <Child></Child> */}
				{/* me retourne les stores */}
				
				< MainHeader />
				<div >
					<Routes>

						<Route path="/" element={<MapData />} />
						<Route path="/welcome"  element={<Welcome />} />
						<Route path="/stores" element={<AllStores />} />
						<Route path="/stores/:id" element={<Store />} />
						<Route path="/new-store" element={<NewStoreForm />} />
						<Route path="/edit-store/:id" element={<EditStore />} />
						
					</Routes>
				</div>
			</div>
		);
		
  
}

export default App;

// our-domain.com/new-meetup => NewMeetupPage
// our-domain.com/meetups => AllMeetupsPage