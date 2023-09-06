import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import {Room } from "@mui/icons-material";
import axios from "axios";
import { Link } from "react-router-dom";
import "./map.css";
import SimpleInput from "../../pages/NewStoreForm";
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default; // eslint-disable-line
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const DisplayMap = (props) => {
  const [viewport, setViewport] = useState({
    latitude: 49.040182,
    longitude: -123.071727,
    zoom: 7,
  });
  const [backendData, setBackendData] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = axios("/allStores").then((response) => {
        setBackendData(response.data);
      });
    };
    fetchData();
  }, []);

  const handleMarkerClick = (id, lat, lng) => {
    console.log("here");
    console.log(id);
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: lng });
  };

  const handleAddClick = (e) => {
    if (!currentPlaceId){
      const {lat, lng} = e.lngLat;
      setNewPlace({
        lat,
        lng,
      });
    }
  };

  console.log(newPlace);
  console.log(backendData);
  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <ReactMapGL
          {...viewport}
          mapboxAccessToken="pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ"
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onMove={(evt) => setViewport(evt.viewState)}
          onClick={handleAddClick}
        >
          {backendData?.map((store, index) => (
            <>
              <Marker
                latitude={store.location.coordinates[1]}
                longitude={store.location.coordinates[0]}
              >
                <Room
                  style={{
                    fontSize: 7 * viewport.zoom,
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleMarkerClick(
                      store._id,
                      store.location.coordinates[1],
                      store.location.coordinates[0]
                    );
                  }}
                />
              </Marker>
              {store._id === currentPlaceId && (
                <Popup
                  key={store._id}
                  latitude={store.location.coordinates[1]}
                  longitude={store.location.coordinates[0]}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                  anchor="left"
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{store.city}</h4>
                    <label>Review</label>
                    <p className="desc">{store.price}</p>
                    <label>Rating</label>
                    <p className="desc">{store.rating}</p>
                    <label>Information</label>
                    <span className="username"></span>
                  </div>
                </Popup>
              )}
            </>
          ))}
          
          {newPlace && (
            <>
              <Marker
                latitude={newPlace.lat}
                longitude={newPlace.lng}
                offsetLeft={-3.5 * viewport.zoom}
                offsetTop={-7 * viewport.zoom}
              >
                <Room
                  style={{
                    fontSize: 7 * viewport.zoom,
                    color: "tomato",
                    cursor: "pointer",
                  }}
                />
              </Marker>
              <Popup
                latitude={newPlace.lat}
                longitude={newPlace.lng}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setNewPlace(null)}
                anchor="left"
              >
                <div>
                  <SimpleInput
                  latitude={newPlace.lat}
                  longitude={newPlace.lng}
                  ></SimpleInput>
                </div>
              </Popup>
            </>
          )}              
        </ReactMapGL>
      </div>
    </>
  );
};
export default DisplayMap;
