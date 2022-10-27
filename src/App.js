import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MapData from './components/map';
import Child from './components/parent';
import Welcome from './pages/Welcome';
import Products from './pages/Products';
import MainHeader from './components/MainHeader';

import Store from './pages/Store';
import NewStore from './pages/NewStore';
const App = () => {

		return (
			<div>
				{/* me retourne la carte */}
				<Child></Child>
				{/* me retourne les stores */}
				
				< MainHeader />
				<div>
					<Routes>

						<Route path="/" element={<MapData />} />
						<Route path="/welcome"  element={<Welcome />} />
						<Route path="/products" element={<Products />} />
						<Route path="/stores/:id" element={<Store />} />
						<Route path="/new-store" element={<NewStore />} />
						
					</Routes>
				</div>
			</div>
		);
		
  
}

export default App;

// our-domain.com/new-meetup => NewMeetupPage
// our-domain.com/meetups => AllMeetupsPage