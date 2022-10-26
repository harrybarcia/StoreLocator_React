import React from 'react';
import MapData from './components/map';
import Child from './components/parent';





const App = () => {

		return (
			<div>
				{/* me retourne la carte */}
				<Child></Child>
				{/* me retourne les stores */}
				<MapData></MapData>
			</div>
		);
		
  
}

export default App;