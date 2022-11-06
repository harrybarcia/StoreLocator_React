import React, {useState, useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import './map.css'
import axios from 'axios';
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ';
const DisplayMap = (props) => {
   
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = axios(
        'http://localhost:3000/api',)
        .then(response => {
          
          setBackendData(response.data);
        })      
    };
    fetchData();
  }, []);


  
    
      

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-123.1207);
    const [lat, setLat] = useState(49.28);
    const [zoom, setZoom] = useState(10);
    
    useEffect(() => {
    
          const map = new mapboxgl.Map({
        
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        function getStores() {
          try{
            console.log("data", backendData);
            console.log("data", typeof(backendData));

            
            const stores = backendData.map(store => {
              return {
      
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [
                    store.location.coordinates[0],
                    store.location.coordinates[1]
                  ]
                },
                properties: {
                  _id: store._id,
                  storeId: store.storeId,
                  formattedAddress:store.location.formattedAddress,  
                  icon: 'rocket',
                  image:store.image,
                  userId:store.userId,
                  city:store.city
                }
              };
            });
            console.log("stores", stores);
            loadMap(stores);
          }
          catch(err){
            console.log(err);
          }
      }
      // Load map with stores
  function loadMap(stores) {
      map.on('load', function() {
        map.addLayer({
          id: 'points',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: stores
            }
          },
          layout: {
            'icon-image': '{icon}-15',
            'icon-size': 1.5,
            'text-field': '{city}',
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.9],
            'text-anchor': 'top'
          }
        });
      });
      
    
    }
    getStores();
    map.on('click', 'points', (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const address = e.features[0].properties.formattedAddress;
      const image = e.features[0].properties.image;
      const storeId = e.features[0].properties._id;
      const userId = e.features[0].properties.userId;
      const city = e.features[0].properties.city;
        console.log(e.features);
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
        
      new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`
        <img src='/images/${image}' style="width:100%;max-height:200px; border-radius:3%;max-height: 182px;object-fit: cover">
        <div>
        <span style="overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
                    line-clamp: 3; 
            -webkit-box-orient: vertical;
            max-height: 60px;">
          </strong>
          ${city}
        </span>
        <span style="overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
                    line-clamp: 3; 
            -webkit-box-orient: vertical;
            max-height: 60px;">
          </strong>
          ${city}
        </span>
        </div>
        <a href='/stores/${storeId}' class="btn">Details</a>
        `)
      .addTo(map);
    });

      
        
    }, 
    [backendData]);
    
    console.log("backendData 160", backendData);
    const deleteStore = async (id) => {
      try {
        const res = await fetch(`/api/${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        console.log(data);
        setBackendData(backendData.filter(store => store._id !== id));
        
      } catch (err) {
        console.error(err);
      }
    }

      

    return (	
      <div className='map-wrapper'>
        <div className='map'>
          <div ref={mapContainer} ></div>
        </div>
        <div>   
            {( backendData && backendData.length > 0) ? backendData.map((store, index) => {
            
                return (
                    <div>
                        <div key={index}>
                            <p>{store.location.formattedAddress}</p>
                            <p>{store.address}</p>
                            <p>{store.image}</p>
                        </div>
                        <button 
                        value={store._id}
                        name={store._id}
                        onClick={() => deleteStore(store._id)}
                        >Delete</button>
                        
                    </div>
                );
            })
            : <p>loading...</p>
            };
        </div>
      </div>
      
      );
}
export default DisplayMap;



