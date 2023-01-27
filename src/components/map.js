import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./map.css";
import axios from "axios";
import { Link } from "react-router-dom";
import "../pages/NewStoreForm.css";
import SearchBar from "./SearchBar";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ";

const DisplayMap = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = axios("http://localhost:3000/api").then((response) => {
        setBackendData(response.data);
      });
    };
    fetchData();
  }, []);

  const [backendData2, setBackendData2] = useState(null);

  useEffect(() => {
    const fetchData2 = async () => {
      const response = axios("http://localhost:3000/api").then((response) => {
        setBackendData2(response.data);
      });
    };
    fetchData2();
  }, []);


  console.log("backendData", backendData);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-123.07);
  const [lat, setLat] = useState(49.31);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
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

        console.log("---end of line 1---");
        loadMap(stores);
      } catch (err) {
        console.log(err);
      }
    }

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
          },
          layout: {
            "icon-image": "{icon}-15",
            "icon-size": 1.5,
            "text-field": "{city}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.9],
            "text-anchor": "top",
          },
        });
      });
    }
    getStores();
    map.on("click", "points", (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const address = e.features[0].properties.formattedAddress;
      const image = e.features[0].properties.image;
      const storeId = e.features[0].properties._id;
      const userId = e.features[0].properties.userId;
      const city = e.features[0].properties.city;
      const price = e.features[0].properties.price;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `
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
          ${price}
        </span>
        </div>
        <a href='/api/${storeId}' class="btn">Details</a>
        `
        )
        .addTo(map);
    });
  }, [backendData]);

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
      try {
        const res = await axios("http://localhost:3000/api");
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

  // console.log(apiCities);

  const [checked, setChecked] = useState([apiCities]);
  console.log(checked);

  useEffect(() => {
    function test() {
      try {
        console.log(apiCities);
        console.log(checked);
        const checkBox = document.querySelectorAll('input[type="checkbox"]');
        const arrayChecked = [];
        for (let i = 0; i < checkBox.length; i++) {
          console.log(checkBox[i].checked);
          if (checkBox[i].checked) {
            arrayChecked.push(checkBox[i].value);
          }
        }
        // console.log("arraychecked", arrayChecked);
        setChecked(arrayChecked);
        console.log("checked", checked);
      } catch (err) {
        console.log(err);
      }
    }
    test();
  }, [apiCities]);

  const handleCheck = (e) => {
    // console.log(checked);
    let updatedList = [...checked];
    // console.log(updatedList);
    if (e.target.checked) {
      console.log("unselected to selected");
      updatedList = [...checked, e.target.value];
      console.log("updatedList", updatedList);
    } else {
      updatedList.splice(checked.indexOf(e.target.value), 1);
    }

    setChecked(updatedList);

    setBackendData(
      backendData2.filter((store) => updatedList.includes(store.city))
    );
  };

  const [rangeValue, setRangeValue] = useState(1000000);

  console.log("checked", checked);
  console.log("backenData", backendData);



  const pull_data = (data) => {
    setBackendData(data);
  };
  
console.log("backendData after pull data", backendData);
  return (
    <div className="map-wrapper">
      <div className="map">
        <ul>
          <input
            type="range"
            min={
              backendData2 &&
              Math.min(...backendData2.map((store) => store.price))
            }
            max={
              backendData2 &&
              Math.max(...backendData2.map((store) => store.price))
            }
            value={rangeValue}
            step="10000"
            onChange={(e) => {
              setRangeValue(e.target.value);
              setBackendData(
                backendData2.filter((store) => store.price <= e.target.value)
              );
            }}
          />
          <li>
            <span>Price range: {rangeValue}</span>
          </li>
        </ul>
        <div className="map-filter">
          {backendData2 && backendData2.length > 0
            ? backendData2
                .reduce((acc, store) => {
                  if (!acc.includes(store.city)) {
                    acc.push(store.city);
                  }
                  return acc;
                }, [])
                .map((item, index) => {
                  return (
                    <div key={index}>
                      <input
                        type="checkbox"
                        id={item}
                        name={item}
                        value={item}
                        defaultChecked={true}
                        onChange={handleCheck}
                      />
                      <label
                        // className={isChecked(item)}
                        htmlFor={item}
                      >
                        {item}
                      </label>
                    </div>
                  );
                })
            : null}
        </div>
      <SearchBar
        func = {pull_data}
        data = {backendData}
      
      />
      

        <div ref={mapContainer}></div>
      </div>
      <div className="content">
        {backendData && backendData.length > 0 ? (
          backendData
            .filter((store) => store.price <= rangeValue)
            .map((store, index) => {
              return (
                <div className="grid_stores" key={index}>
                  <div className="content-box">
                    {/* <p>{store.location.formattedAddress}</p>
                            <p>{store.address}</p> */}
                    <p>{store.city}</p>
                    <p>{store.image}</p>
                    <p>{store.price}</p>
                  </div>
                  <div className="content-box-button">
                    <button
                      className="stores_button"
                      value={store._id}
                      name={store._id}
                      onClick={() => deleteStore(store._id)}
                      type="button"
                    >
                      Delete
                    </button>
                    <button>
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
    </div>
  );
};
export default DisplayMap;
