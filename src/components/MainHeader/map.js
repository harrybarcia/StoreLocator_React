import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import {Room,Star } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { Link } from "react-router-dom";
import "./map.css";
import SimpleInput from "../../pages/NewStoreForm";
import StarRating from "../StarRating";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
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
  const mapRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = axios("/allStores").then((response) => {
        setBackendData(response.data);
      });
    };
    fetchData();
  }, [newPlace]);

  const handleMarkerClick = (id, lat, lng) => {
    console.log("here");
    console.log(id);
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {

    if (mapRef.current) {
      mapRef.current.getMap().flyTo({
        center: [e.lngLat.lng,e.lngLat.lat],
        speed: 0.3,
        curve: 1, // Example coordinates (New York City)
      });
    }

    if (!currentPlaceId){
      const {lat, lng} = e.lngLat;
      setNewPlace({
        lat,
        lng,
      });
      setIsEditMode(false);
    }
  };

  const handleCloseForm = () => {
    setNewPlace(null)
    setIsEditMode(false);
    };

    const closePopup = () => {
      setCurrentPlaceId(null)
      setIsEditMode(false);
      console.log("here edit ")


    }

    const handleEditClick = () => {
    setIsEditMode(true);
  };

    const handleCancelClick = () => {
    // Cancel editing and revert to view mode
    setIsEditMode(false);
    // Optionally, you can reset the form data to its initial state
    // setFormData(initialData);
  };

  const handleSaveClick = () => {
    // Handle saving data and exit edit mode
    setIsEditMode(false);
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
          ref={mapRef}
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
              {store._id === currentPlaceId && isEditMode === false && (
                <Popup
                  key={store._id}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => closePopup()}
                  anchor="left"
                >
                  <button className="mimic-popup-close-button">
                    <CloseIcon
                      style={{
                        fontSize: 30,
                        color: "tomato",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{store.city}</h4>
                    <label>Review</label>
                    <p className="desc">{store.price}</p>
                    <label>Rating</label>
                    <p className="rating">
                      <div className="rating">
                        {Array(store.rating).fill(<Star className="star" />)}
                      </div>
                    </p>
                    <label>Information</label>
                    <span className="username"></span>
                  </div>
                  <button>
                  <EditIcon onClick={handleEditClick}>Edit</EditIcon>
                  </button>
                </Popup>
              )}
              {store._id === currentPlaceId && isEditMode === true && (
                <Popup
                  key={store._id}
                  latitude={store.location.coordinates[1]}
                  longitude={store.location.coordinates[0]}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => closePopup()}
                  anchor="left"
                  
                >
                  <div>
                    <button className="mimic-popup-close-button">
                      <CloseIcon
                        style={{
                          fontSize: 30,
                          color: "tomato",
                          cursor: "pointer",
                        }}
                      />
                    </button>
                    <div>
                      <SimpleInput
                        latitude={store.location.coordinates[1]}
                        longitude={store.location.coordinates[0]}
                        onClose={handleCloseForm}
                        onCancel={handleCancelClick}
                        isEditMode={isEditMode}
                        existingData={store}
                        id = {currentPlaceId}
                      ></SimpleInput>
                    </div>
                    
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
                <button className="mimic-popup-close-button">
                  <CloseIcon
                    style={{
                      fontSize: 30,
                      color: "tomato",
                      cursor: "pointer",
                    }}
                  />
                </button>
                <div>
                  <SimpleInput
                    latitude={newPlace.lat}
                    longitude={newPlace.lng}
                    newPlace={newPlace}
                    onClose={handleCloseForm}
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
