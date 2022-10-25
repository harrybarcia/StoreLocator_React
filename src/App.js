import React, {useState, useEffect, useRef} from 'react';
import { Helmet} from 'react-helmet';
import mapboxgl from 'mapbox-gl';
import DisplayMap from './components/map';


mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ';



const App = () => {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(-70.9);
	const [lat, setLat] = useState(42.35);
	const [zoom, setZoom] = useState(9);

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom
		});
	});
		return (
			<div>
				<div ref={mapContainer} className="map-container" />
				<DisplayMap></DisplayMap>
			</div>
		);
		
  
}

export default App;