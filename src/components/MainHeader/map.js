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
  const [colorMainFilter, setColorMainFilter] = useState(null)
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
  }, [newPlace, isEditMode, dataFetched, filteredData]);

  useEffect(() => {
  }, [permanentData]
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
    // CHECK THE CASE OF NEWFORM
    // Check when the user deletes when on selection, it doesn't disapear from the page
    // Create a copy of the filteredData to avoid mutating state directly
    console.log('filteredData', filteredData);
    const updatedFilteredData = filteredData.map((store) => {
      console.log('store', store);

      // Check if the store matches the updatedStoreData
      if (store._id === updatedStoreData.data.data._id) {
        // Replace the matching store with the updated data
        return updatedStoreData.data.data;
      }
      // If it doesn't match, keep the store as is
      return store;
    });

    // Update the filteredData with the modified array
    setFilteredData(updatedFilteredData);


    // localStorage.setItem('cachedData', JSON.stringify(data));
  };
  const closePopup = () => {
    setIsOpen(false)
    setCurrentPlaceId(null)
    setIsEditMode(false);
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
      }
    } catch (error) {
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

  const dataFromDropdown = (data) => {
    setFilteredData(data)
  }
  const receiveDataFromModal = (open) => {
    setIsOpen(open)
    setCurrentPlaceId(null)
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
  console.log('inputDataFromDropdown', inputDataFromDropdown);
  const mapData = filteredData?.length >= 0 && filteredData?.length < permanentData?.length ? filteredData : permanentData


  // // I retrieve the data of mapData, if the data is equal to the colors.name then, retrieve the color.color of that item
  // for (const mItem of mapData){
  //   for (const tItem of typeObject){
  //     if (mItem.data ===)
  //   }
  // }
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
        <div className="flex flex-end right-0 absolute z-20 ">
          <div >
            {inputDataFromDropdown.map((type, typeIndex) => (
              <div key={typeIndex}>
                <h2 className="font-bold invisible ">{type.key}</h2>
                <ul className="flex flex-col  ">
                  {type.colors.map((item, index) => (
                    <li key={index}>
                      <div
                        className="w-3 rounded-full h-3 m-2"
                        style={{ backgroundColor: `${item.color}` }}
                      >
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className=" p-4 w-100"
          // style={{ height: "auto", maxHeight: '77%', overflow: "scroll", width: "auto", backgroundColor: "white", padding: "1em", position: "absolute", border: "1px", bottom: "20px", right: "20px", zIndex: "10" }}
          >
            <Select
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
                  latitude={store.location.coordinates[1]}
                  longitude={store.location.coordinates[0]}
                  onClick={() => setIsOpen(true)}
                >
                  <CircleIcon
                    style={{
                      fontSize: 4 * viewport.zoom,
                      fill: store?.typeObject[0]?.data[0].color,
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
                {store._id === currentPlaceId && isEditMode === false && (
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
                  ></CustomPopup>
                )}
                {store._id === currentPlaceId && isEditMode === true && (
                  <Popup
                    key={store._id}
                    latitude={store.location.coordinates[1]}
                    longitude={store.location.coordinates[0]}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => closePopup()}
                    anchor="none"
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
                          id={currentPlaceId}
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
                    onCancel={() => handleCancelClick()}

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