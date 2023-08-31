import React, { useLayoutEffect, useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { makeStyles } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import "./map.css";
import "../index.css";
import axios from "axios";
import { Link } from "react-router-dom";
import "../pages/NewStoreForm.css";
import SearchBar from "./SearchBar";
import * as turf from "@turf/turf";
import { isMobile } from 'react-device-detect';
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default; // eslint-disable-line


 
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const DisplayMap = (props) => {
  const [backendData, setBackendData] = useState(null);
  const [radius, setRadius] = useState(0.5);
  // const coordinates = [-123.07, 49.31];
  const [checkRadius, setCheckRadius] = useState(true);
  const [center, setCenter] = useState([0, 0]);
  const [rangeValue, setRangeValue] = useState(620000);

  useEffect(() => {
    const fetchData = async () => {
      const response = axios("/allStores").then((response) => {
        setBackendData(response.data);
      });
    };
    fetchData();
  }, []);
  console.log(backendData);
  const [backendData2, setBackendData2] = useState(null);

  useEffect(() => {
    const fetchData2 = async () => {
      const response = axios("/allStores").then((response) => {
        setBackendData2(response.data);
      });
    };

    fetchData2();
  }, []);
  
  

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
    
    

    const arrayCoordinates = [center[0], center[1]];
    
    const stores = backendData2.map((store) => {
      const mystore = store.location.coordinates;
      const distance = Math.round(
        turf.distance(turf.point(arrayCoordinates), turf.point(mystore), {
          units: "meters",
        })
      );

      store.distance = distance;
      return store;
    });
    
    stores.sort((a, b) => {
      if (a.distance > b.distance) {
        return 1;
      }
      if (a.distance < b.distance) {
        return -1;
      }
      return 0; // a must be equal to b
    });
    // I display the stores by distance
    const storesByDistance = stores.filter(
      (store) => store.distance < radius * 1000
    );
    
    setBackendData(storesByDistance);
  };

  // 
  const mapContainer = useRef(null);
  console.log(mapContainer)
  const [lng, setLng] = useState(-123.07);
  const [lat, setLat] = useState(49.31);
  const [zoom, setZoom] = useState(13);

  useCallback(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

  }, [lng, lat, zoom]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    const listings = document.getElementsByClassName("listings");

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 0,
    });
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const listingId = listing.id;
      listings[i].addEventListener("mouseover", function () {
        let popUps = document.getElementsByClassName('mapboxgl-popup');
        for (let i = 0; i < popUps.length; i++) {
          popUps[i].remove();
        }
        popup
          .setLngLat(backendData[i].location.coordinates)
          .setHTML(
            `<h3>${backendData[i].location.formattedAddress}</h3><p>${backendData[i].price}</p>`
          )
          .addTo(map);
      });
      listings[i].addEventListener("mouseout", function () {
        let popUps = document.getElementsByClassName('mapboxgl-popup');
        for (let i = 0; i < popUps.length; i++) {
          popUps[i].remove();
        }
      });
    }
    function getStores() {
      try {
        const stores = backendData.map((store) => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                store.location.coordinates[0],
                store.location.coordinates[1],
              ],
            },
            properties: {
              _id: store._id,
              storeId: store.storeId,
              formattedAddress: store.location.formattedAddress,
              image: store.image,
              userId: store.userId,
              city: store.city,
              price: store.price,
            },
          };
        });
        loadMap(stores);
      } catch (err) {
        
      }
    }
    map.on("load", function () {
      var options = {
        steps: 30,
        units: "kilometers",
        properties: { foo: "bar" },
      };

      const circle2 = turf.circle(center, radius, options);
      // I add the layer circle on click, centered on the click locations
      map.addLayer({
        id: "circle2",
        type: "fill",
        source: {
          type: "geojson",
          data: circle2,
        },
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": "#007cbf",
          "fill-opacity": 0.5,
        },
      });
    });
    
    // Load map with stores
    function loadMap(stores) {
      map.on("load", function () {
        map.addLayer({
          id: "points",
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: stores,
            },
          }
        });
        backendData.map((store) => {
          var el = document.createElement('div');
          el.className = 'marker';
          el.innerHTML =`<div style="position: absolute; left:0px;top:0px;touch-action:pan-xpan-y;transform:translate(-2.045px,-2.7039px);z-index:2002;display:block;"><div style="transform:translate(calc(-50%+0px),calc(50% + 0px)); transition: transform 0.2s ease 0s; left: 50%; position: absolute; bottom: 0px; z-index: 0; pointer-events: auto; font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, &quot;Helvetica Neue&quot;, sans-serif;">		<button class="_fwxpgr" aria-label="" data-veloute="map/markers/BasePillMarker" style="color: inherit; border: none; margin: 0px; padding: 0px; background: transparent; width: auto; overflow: visible; font: inherit;">			<div style="--content-mini-box-shadow:0 0 0 1px rgba(0, 0, 0, 0.32), 0px 2px 4px rgba(0, 0, 0, 0.18); align-items: center; cursor: pointer; display: flex; height: 28px; position: relative; transform: scale(1); transform-origin: 50% 50%; transition: transform 150ms ease 0s;">				<div style="background-color: rgb(250, 250, 250); border-radius: 28px; box-shadow: rgb(176, 176, 176) 0px 0px 0px 1px inset; color: rgb(34, 34, 34); height: 28px; padding: 0px 8px; position: relative; transform: scale(1); transform-origin: 50% 50%; transition: transform 250ms cubic-bezier(0, 0, 0.1, 1) 0s;">					<div style="align-items: center; display: flex; height: 100%; justify-content: center; opacity: 1; transition: opacity 250ms ease 0s; white-space: nowrap;"><span style="font-weight:bold" class="_1rhps41">${store.price.toLocaleString()} €</span></div></div></div></button></div></div>`  ;

          new mapboxgl.Marker(el, {closeOnClick:true, closeButton:false })
          
          .setLngLat([store.location.coordinates[0],store.location.coordinates[1]])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <a style={{position:absolute;top:0px;left:0px;width:100%;height:100%;display:inline}}; href='/api/${store._id}' className={{btn}}>
              <img src='/images/${store.image}' alt="" style="width:100%;border-radius:3%;max-height: 182px;object-fit: cover">
            </a>'
            
            <div>
              <div style="justify-content: space-between;display:flex;flex-direction:row">
                <p>${store.city}</p>
                
              </div>
                <p>$ ${store.price.toLocaleString()} CAD</p>
            </div>
            
          `
          ))
          .addTo(map);
        });
          


        const bounds = new mapboxgl.LngLatBounds(); // Create a bounding box
        stores.forEach((store) => {
          // Add each store to the bounding box
          bounds.extend(store.geometry.coordinates);
        });
        map.fitBounds(bounds, {
          padding: {
            top: 200,
            bottom: 200,
            left: 100,
            right: 100,
          },
          maxZoom: 14,



        });
        map.on("click", function (e) {
          if (map.getLayer("circle2")) {
            map.removeLayer("circle2");
            map.removeSource("circle2");
          }
          // If the layer "points" does not exists, display the information
          
          if (
            !popup
          ) {
            const center = [e.lngLat.lng, e.lngLat.lat];
            setCenter(center);
          
            var options = {
              steps: 20,
              units: "kilometers",
              properties: { foo: "bar" },
            };
            const circle2 = turf.circle(center, radius, options);
            // I add the layer on click, centered on the click location
            map.addLayer({
              id: "circle2",
              type: "fill",
              source: {
                type: "geojson",
                data: circle2,
              },
              layout: {
                visibility: "visible",
              },
              paint: {
                "fill-color": "#007cbf",
                "fill-opacity": 0.5,
              },
            });
            function getStores() {
              try {
                const stores = backendData.map((store) => {
                  return {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [
                        store.location.coordinates[0],
                        store.location.coordinates[1],
                      ],
                    },
                    properties: {
                      _id: store._id,
                      storeId: store.storeId,
                      formattedAddress: store.location.formattedAddress,
                      icon: "rocket",
                      image: store.image,
                      userId: store.userId,
                      city: store.city,
                      price: store.price,
                    },
                  };
                });
                
                loadMap(stores);
              } catch (err) {
                
              }
            }
            getStores();

            const markers = document.getElementsByClassName("mapboxgl-marker");          
            if (markers[0]) markers[0].remove();
            const coordinates = e.lngLat;
            const marker = new mapboxgl.Marker({
              color: "red",
              draggable: true,
            });
            // I retrieve all the distances from the point I just clicked and I sort them
            if (markers[0]) markers[0].remove();
            marker.setLngLat(coordinates).addTo(map);
            const arrayCoordinates = [coordinates.lng, coordinates.lat];
            const stores = backendData.map((store) => {
              const mystore = store.location.coordinates;
              const distance = Math.round(
                turf.distance(
                  turf.point(arrayCoordinates),
                  turf.point(mystore),
                  {
                    units: "meters",
                  }
                )
              );
              store.distance = distance;
              return store;
            });
            
            stores.sort((a, b) => {
              if (a.distance > b.distance) {
                return 1;
              }
              if (a.distance < b.distance) {
                return -1;
              }
              return 0; // a must be equal to b
            });
            // I display the stores by distance
            const storesByDistance = stores.filter(
              (store) => store.distance < radius * 1000
            );
            
            setBackendData(storesByDistance);
          }
        });
        map.on("click", (e) => {
          const classes = useStyles();

  const longitude = -170;
  const latitude = 48;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    // ...
    // Close the popup after form submission
    popup.remove();
  };

  const popupContent = (
    <div className={classes.popupContent}>
      <h3>Add a Pin</h3>
      <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                  />
                  <label>Rating</label>
                  <select >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
    </div>
  );

  // Create the Mapbox GL JS popup
  const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
    .setLngLat([longitude, latitude])
    .setDOMContent(popupContent);

  // Add the popup to the map
  popup.addTo(map);

        });
      });
    }



    // I call the function to load the map with the stores
    getStores();

      
  }, [backendData, radius, center]);



  const deleteStore = async (id) => {
    try {
      const res = await fetch(`/api/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setBackendData(backendData.filter((store) => store._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // I retrieve all my stores  from the backend and reduce them according to the cities
  const [apiCities, setApiCities] = useState(null);

  useEffect(() => {
    const getCities = async () => {
      const user = localStorage;
      
      try {
        
        const res = await axios("/allStores");
        const response = await res.data;
        const reducedCities = response.reduce((acc, store) => {
          if (!acc.includes(store.city)) {
            acc.push(store.city);
          }
          return acc;
        }, []);
        setApiCities(reducedCities);
      } catch (err) {
        console.error(err);
      }
    };
    getCities();
  }, []);

  // I create a state to store the checked cities

  const [checked, setChecked] = useState([apiCities]);
  // 

  useEffect(() => {
    function test() {
      try {
        // 
        // 
        const checkBox = document.querySelectorAll('input[type="checkbox"]');
        const arrayChecked = [];
        for (let i = 0; i < checkBox.length; i++) {
          // 
          if (checkBox[i].checked) {
            arrayChecked.push(checkBox[i].value);
          }
        }
        // 
        setChecked(arrayChecked);
        // 
      } catch (err) {
        
      }
    }
    test();
  }, [apiCities]);

  const handleCheck = (e) => {
    // 
    let updatedList = [...checked];
    // 
    if (e.target.checked) {
      
      updatedList = [...checked, e.target.value];
      
    } else {
      updatedList.splice(checked.indexOf(e.target.value), 1);
    }

    setChecked(updatedList);

    setBackendData(
      backendData2.filter((store) => updatedList.includes(store.city))
    );
  };
  const handleReset = () => {
    setChecked([]);
    setBackendData(backendData2);
    setRangeValue(620000);



    setCenter([0, 0]);
  };

  const handleCheckSelection = (e) => {
    if (checkRadius === true) {
      axios.get("/myStores").then((res) => {
        setBackendData(res.data);
      });
      setCheckRadius(false);
    } else {
      axios.get("/allStores").then((res) => {
      setBackendData(res.data);
      });
      setCheckRadius(true);

      
    }
  };
  

  // 
  // 

  // I use this function to retrieve the data fetched on the SearchBar component
  const pull_data = (data) => {
    setBackendData(data);
  };
  console.log(backendData? backendData.length : "no data");

  // The map is removed on mobile
  const [showMap, setShowMap] = useState(false);
  const addMap = () => {
    setShowMap(!showMap);
    
  };
  const [mobile, setMobile] = useState(true)
  useEffect(()=>{
  if (window.innerWidth < 768){
    setMobile(mobile)
  } else{
    setMobile(!mobile)
  }
  }, [])
  console.log(window.innerWidth);
  console.log(mobile)
  return (
    <div className="map-wrapper flex-col md:flex-row ">
      <div id="listStore" className="flex flex-wrap overflow-scroll justify-between w-full lg:w-1/5 max-w-350">
        {backendData && backendData.length > 0 ? (
          backendData
            .filter((store) => store.price <= rangeValue)
            .map((store, index) => {
              return (
                <div className="grid_stores lg:h-2/5" key={index}>
                  <div className="listings" id={store._id} key={store._id}>
                    <div
                      style={{
                        height: "100%",
                      }}
                      key={store._id}
                    >
                      <img
                      key={store._id}
                        src={`images/${store.image}`}
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "5%",
                        }}
                        alt="images"
                        />
                    </div>
                    <div className = "listings-info">
                    <p>{store.city}</p>
                    <p>
                    <span>&#9733;</span> {store.rating? store.rating.toFixed(2)  : ""} 
                    </p>
                    </div>
                    <p>$ {store.price.toLocaleString()} CAD</p>
                  </div>
                  <div className="flex justify-center">
                    <button 
                      value={store._id}
                      name={store._id}
                      onClick={() => deleteStore(store._id)}
                      type="button"
                    >
                      Delete
                    </button>
                    <button className="mx-2">
                      <Link to={`/edit-store/${store._id}`}>Edit my store</Link>
                    </button>
                  </div>
                </div>
              );
            })
        ) : (
          <p>No Store, please login and add a new one!</p>
        )}
        ;
      </div>
      <div className={isMobile ? (showMap ? "absolute  mx-10 justify-center w-4/5 h-full z-0" : "invisible") : "flex justify-center w-4/5 h-full z-0"}>
        <div className="map-filter">
          <select
            onChange={(e) => {
              if (e.target.value === "All") {
                setBackendData(backendData2);
              } else {
                setBackendData(
                  backendData2.filter((store) => store.city === e.target.value)
                );
              }
            }}
          >
            <option value="All">Select All</option>

            {backendData2 && backendData2.length > 0 ? (
              backendData2
                .reduce((acc, store) => {
                  if (!acc.includes(store.city)) {
                    acc.push(store.city);
                  }
                  return acc;
                }, [])
                .map((store) => {
                  
                  return (
                    <option key={store._id} value={store}>
                      {store}
                    </option>
                  );
                })
            ) : (
              <option value="No City yet">No city yet</option>
            )}
          </select>

          <SearchBar func={pull_data} />
          <div className="range">
            <div className="sliderValue">
              <span id="span_range"></span>
            </div>
            <div className="field">
              <div className="value left">0</div>
              <input
                id="input_range"
                type="range"
                min="0"
                max={
                  backendData2 &&
                  Math.max(...backendData2.map((store) => store.price))
                }
                value={rangeValue}
                step="1000"
                onChange={(e) => {
                  setRangeValue(e.target.value);
                  setBackendData(
                    backendData2.filter(
                      (store) => store.price <= e.target.value
                    )
                  );
                  const slideValue = document.getElementById("span_range");
                  const inputSlider = document.getElementById("input_range");
                  
                  
                  inputSlider.oninput = () => {
                    let value = inputSlider.value;
                    
                    slideValue.textContent = parseInt(value).toLocaleString();
                    slideValue.style.left = value ? value / 13333 + "%" : "50%";
                    slideValue.classList.add("show");
                    
                  };
                }}
                onBlur={(e) => {
                  const slideValue = document.querySelector("span");
                  slideValue.classList.remove("show");
                }}
              />
              <div className="value right">
                {backendData2 &&
                  Math.max(
                    ...backendData2.map((store) => store.price)
                  ).toLocaleString()}
              </div>
            </div>
          </div>
          <input
            type="number"
            min="0"
            max="10"
            value={radius}
            onChange={handleRadiusChange}
            className="slider"
            style={{
              width: "100px",
              height: "20px",
              margin: "0 10px",
            }}
            id="myRange"
            step={0.1}
          />
          <p>Value: {radius} km</p>
          <input
            type="checkbox"
            id="myCheck"
            name="myCheck"
            onChange={handleCheckSelection}
            value={checkRadius}
            
          />
          <button type="reset" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div ref={mapContainer}></div>
      </div>
      <div className={isMobile?"z-1000 m-150 absolute":"hidden"}>
        <button onClick={addMap}>{showMap?"See list":"Show map"}</button>

      </div>
    </div>
  );
};
export default DisplayMap;