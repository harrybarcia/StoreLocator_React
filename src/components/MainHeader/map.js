import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import {AirOutlined, Room,Star } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import "./map.css";
import SimpleInput from "../../pages/NewStoreForm";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SuppressionModal from '../SuppressionModal';
import Dropdown from "../UI/Dropwdown"


mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default; // eslint-disable-line
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const DisplayMap = (props) => {
  const [viewport, setViewport] = useState({
    latitude: 49.040182,
    longitude: -123.071727,
    zoom: 7,
  });
  const [permanentData, setPermanentData] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const mapRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [showModal, setShowModal] = useState(false);
  const store = {
    address, rating, city, price, image
  }
  const [isOpen, setIsOpen] = useState(false);
  const [dataFetched, setDataFetched] = useState(true);
  const  [filteredData, setFilteredData] = useState([])
  const [filter, setFilter] = useState(false)



  useEffect(() => {
    const dataFetched = false
    const cachedData = localStorage.getItem('cachedData');
    // if the data is in the cache, just add it to the permament data
    if (cachedData && dataFetched) {
      setPermanentData(JSON.parse(cachedData));
    // if the data is not in the cache, fetch the data.
    } else if (!dataFetched) {
      const fetchData = async () => {
        const response = axios("/allStores").then((response) => {
          setPermanentData(response.data);
          localStorage.setItem('cachedData', JSON.stringify(response.data));
          setDataFetched(true);

        });
      };
      fetchData();
    }
  }, [newPlace, isEditMode, dataFetched, filteredData]);

  useEffect(() => {
  }, [permanentData]
  )

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

  const handleCloseForm = (data) => {
    setNewPlace(null)
    setIsEditMode(false);
    setPermanentData(data)
    localStorage.setItem('cachedData', JSON.stringify(data));
  };

  const closePopup = () => {
    setCurrentPlaceId(null)
    setIsEditMode(false);
    console.log("here edit ")
  }

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleDeleteClick = async (id) => {
    setShowModal(false)
    try {
      const response = await axios.delete(`/api/${id}`);
      if (response.status === 200) {
        const storesInLocalStorage = JSON.parse(localStorage.getItem('cachedData')) || [];
        const updatedStoresInLocalStorage = storesInLocalStorage.filter((store) => store._id !== id);
        localStorage.setItem('cachedData', JSON.stringify(updatedStoresInLocalStorage));
        const response = axios("/allStores").then((response) => {
          setPermanentData(response.data);
          localStorage.setItem('cachedData', JSON.stringify(response.data));
        })
        
        setCurrentPlaceId(null)
      } else {
        console.error('Failed to delete store');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

    const handleCancelClick = () => {
    // Cancel editing and revert to view mode
    setIsEditMode(false);
    setNewPlace(null)

    // Optionally, you can reset the form data to its initial state
    // setFormData(initialData);
  };

  const handleSaveClick = () => {
    // Handle saving data and exit edit mode
    setIsEditMode(false);
  };

  const dataFromDropdown = (data) =>{
    setFilteredData(data)
  }
  const checkFromDropdown = (isChecked) => {
    console.log(isChecked)
    if (!isChecked){
      setFilteredData(null)
    }

  }
  console.log("filtereddata", filteredData)
  console.log(permanentData)

  const mapData = filteredData?filteredData:permanentData

  return (
    <>
      <Dropdown
        sendDataFromDropdown = {dataFromDropdown}
        dataFromParent = {permanentData}
        sendCheckFromDropdown = {checkFromDropdown}

      ></Dropdown>
      <div style={{ height: "80vh", width: "100%" }}>
        <ReactMapGL
          {...viewport}
          mapboxAccessToken="pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ"
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onMove={(evt) => setViewport(evt.viewState)}
          onClick={handleAddClick}
          ref={mapRef}
        >
          {
          mapData?.map((store, index) => (
            <>
              <Marker
                latitude={store.location.coordinates[1]}
                longitude={store.location.coordinates[0]}
              >
                <Room
                  style={{
                    fontSize: 5 * viewport.zoom,
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
                  latitude={store.location.coordinates[1]}
                  longitude={store.location.coordinates[0]}
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
                    <label>Address</label>
                    <h4 className="place">{store.address}</h4>
                    <label>Price</label>
                    <p className="desc">{store.price}</p>
                    <img src={"/images/" + store.image} />
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
                  <EditIcon onClick={handleEditClick}></EditIcon>
                  </button>
                  <button>
                  <DeleteIcon onClick={() => setShowModal(true)}></DeleteIcon>
                  </button>
                  <SuppressionModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onDelete={() =>handleDeleteClick(store._id)}
                  />
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
                        handleSaveClick={handleSaveClick}
                        data={store}
                        
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
                // offsetLeft={-3.5 * viewport.zoom}
                // offsetTop={-7 * viewport.zoom}
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
                    isEditMode = {isEditMode}
                    data={store}
                    onCancel = {() => handleCancelClick()}
                    
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
