import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { Room, Star } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import "./map.css";
import SimpleInput from "../../pages/NewStoreForm";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SuppressionModal from '../SuppressionModal';
import Dropdown from "../UI/Dropdown"
import SearchBar from "../SearchBar";
import CircleIcon from '@mui/icons-material/Circle';
import ModalContent from "../UI/ModalContent";
import CustomPopup from "../UI/Popup";
import Select from "../UI/Select"


mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default; // eslint-disable-line
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const styles={
  app:{
    backgroundColor:'rgba(0,0,0,0.1)',
    justifyItems:'center',
    alignItems:'center',
    display:'grid',
    height:'100vh',
    fontFamily:'Arial',
    color:'rgba(0,0,100,1)',
    gridTemplateColumns:'1fr',
    fontSize:25
  },
  select:{
    width:'100%',
    maxWidth:600
  }
}

const options=[
  {label:'React',value:'react'},
  {label:'ReactNative',value:'react-native'},
  {label:'JavaScript',value:'js'},
  {label:'CSS',value:'css'},
]




const DisplayMap = (props) => {
  const [viewport, setViewport] = useState({
    latitude: 54.640182,
    longitude: -98.071727,
    zoom: 3.5,
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
  const [order, setNewOrder] = useState(null)
  const store = {
    address, rating, city, price, image, order
  }
  const [dataFetched, setDataFetched] = useState(true);
  const [filteredData, setFilteredData] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [inputDataFromDropdown, setInputDataFromDropdown] = useState([])
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
  }, [newPlace, dataFetched, filteredData, ]);

  useEffect(() => {
  }, [permanentData]
  )
  useEffect(() => {
  }, [isEditMode]
  )
  
  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    if (mapRef.current) {
      mapRef.current.getMap().flyTo({
        center: [e.lngLat.lng, e.lngLat.lat],
        speed: 0.3,
        curve: 1, // Example coordinates (New York City)
      });
    }

    if (!currentPlaceId) {
      const { lat, lng } = e.lngLat;
      setNewPlace({
        lat,
        lng,
      });
      setIsEditMode(false);
    }
  };
  const handleCloseForm = (updatedStoreData) => {
    console.log('updatedStoreData', updatedStoreData);
    setNewPlace(null)
    setIsEditMode(false);
    console.log('filteredData', filteredData);
    const updatedFilteredData = filteredData.map((store) => {
      console.log('store', store);
      // Check if the store matches the updatedStoreData
      if (store._id === updatedStoreData?.data.data._id) {
        // Replace the matching store with the updated data
        return updatedStoreData.data.data;
      }
      // If it doesn't match, keep the store as is
      return store;
    });
    // Update the filteredData with the modified array
    setPermanentData(updatedFilteredData);
    // localStorage.setItem('cachedData', JSON.stringify(data));
  };
  const closePopup = () => {
    setIsOpen(false)
    setCurrentPlaceId(null)
    setIsEditMode(false);
  }
  const handleEditClick = () => {
    setIsEditMode((prev) => !prev)
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
      }
    } catch (error) {
    }
  };

  const dataFromDropdown = (data) => {
    setFilteredData(data)
  }
  const receiveDataFromModal = (open) => {
    setIsOpen(open)
    setCurrentPlaceId(null)
    setIsEditMode(false)
  }
  const pullData = (data) => {
    setFilteredData(data)
    if (!data) {
      setFilteredData(null)
    }

  }
  const handleInputDataFromDropdown = (data) => {
    setInputDataFromDropdown(data)
  }

  const handleDragEnd = async (e, store, props) => {
    // Create a new location object
    const newLocation = { coordinates: [e.lngLat.lng, e.lngLat.lat] };
    // Make the PATCH request to update the store's location
    const id = store._id;
    try {
      const response = await axios.patch(`/edit-store/${id}`, {
        location: newLocation,
      });
      const data = response.data;
      console.log('data', data);
    } catch (error) {
      console.error('Error updating store location:', error);
    }
  };
  
  const mapData = filteredData?.length >= 0 && filteredData?.length < permanentData?.length ? filteredData : permanentData

  return (
    <>
      <div className="flex flex-row flex-wrap m-2">
        <Dropdown
          sendDataFromDropdown={dataFromDropdown}
          dataFromParent={mapData}
          permanentDataFromParent={permanentData}
          sendFieldsDataFromDropdown={handleInputDataFromDropdown}
        ></Dropdown>
        <SearchBar
          func={pullData}
        ></SearchBar>
      </div>
      <div style={{ height: "80vh", width: "100%", position: "relative" }}>
        <div className="flex flex-end right-0 absolute z-20 top-20">
          <div className=" p-4 w-100"
          >
            <Select
              className="top-20"
              sendDataFromDropdown={dataFromDropdown}
              dataFromParent={mapData}
              permanentDataFromParent={permanentData}
              sendFieldsDataFromDropdown={handleInputDataFromDropdown}
            ></Select>
          </div>

        </div>
        <ReactMapGL
          {...viewport}
          mapboxAccessToken="pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ"
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onMove={(evt) => setViewport(evt.viewState)}
          onViewportChange={(newViewport) => setViewport(newViewport)}
          onClick={handleAddClick}
          ref={mapRef}
        >
          {
            mapData?.map((store, index) => (
              <>
                <Marker
                  draggable
                  onDragEnd={(e) => handleDragEnd (e, store)}
                  latitude={store.location.coordinates[1]}
                  longitude={store.location.coordinates[0]}
                  onClick={() => setIsOpen(true)}
                >
                  <CircleIcon
                    style={{
                      fontSize: 4 * viewport.zoom,
                      fill: store?.typeObject[0]?.data[0]?.color,
                      stroke: "white",
                      cursor: "pointer",
                      strokeWidth: 3

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
                      <CustomPopup
                      key={store._id}
                      closeButton={true}
                      closeOnClick={false}
                      onClose={() => closePopup()}
                      anchor="none"
                      latitude={store.location.coordinates[1]}
                      longitude={store.location.coordinates[0]}
                      onClick={() => { setIsOpen(true) }}
                      isOpen={isOpen}
                      sendDataFromModal={receiveDataFromModal}
                      dataFromParent={store}
                      loading={loading}
                      handleEditClick={handleEditClick}
                      isEditMode={isEditMode}
                      >  
                      </CustomPopup>
                )}
              </>
            ))}

          {newPlace && (
            <>
              <Marker
                latitude={newPlace.lat}
                longitude={newPlace.lng}
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

                anchor="none"
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
                    isEditMode={isEditMode}
                    data={store}
                    // onCancel={() => handleCancelClick()}

                  ></SimpleInput>
                </div>
              </Popup>
            </>
          )}
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <NavigationControl />
          </div>
        </ReactMapGL>

      </div>
    </>
  );
};
export default DisplayMap;