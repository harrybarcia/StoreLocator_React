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
import CustomPopup from "../UI/Popup";
import Select from "../UI/Select"
import FlashMessage from "../UI/FlashMsg";
import ConvertCsvToJson from "../functions/ConvertCsvToJson";
import GeoJsonEditor from "../GeoJsonEditor";
import FullTable from "../FullTable";


mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default; // eslint-disable-line
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const styles = {
  app: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyItems: 'center',
    alignItems: 'center',
    display: 'grid',
    height: '100vh',
    fontFamily: 'Arial',
    color: 'rgba(0,0,100,1)',
    gridTemplateColumns: '1fr',
    fontSize: 25
  },
  select: {
    width: '100%',
    maxWidth: 600
  }
}

const options = [
  { label: 'React', value: 'react' },
  { label: 'ReactNative', value: 'react-native' },
  { label: 'JavaScript', value: 'js' },
  { label: 'CSS', value: 'css' },
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
  const store = { address, rating, city, price, image, order }
  const [filteredData, setFilteredData] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [inputDataFromDropdown, setInputDataFromDropdown] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const [originalCoordinates, setOriginalCoordinates] = useState([]);
  const [showStreet, setShowStreet] = useState(true)


  const switchToSatelliteView = () => {
    setShowStreet((prev) => !prev)
  };

  useEffect(() => {
    const cachedData = localStorage.getItem('cachedData');
    console.log('permanentData', permanentData);
    if (cachedData && dataFetched) {
      console.log('cachedData', cachedData.length > 0);
      console.log('dataFetched', dataFetched);
      // Parse cached data and update the permanent data
      try {
        const parsedData = JSON.parse(cachedData);
        setPermanentData(parsedData);
      } catch (error) {
        console.error('Error parsing cached data:', error);
      }
    } else if (!dataFetched) {
      const fetchData = async () => {
        try {
          const response = await axios("/allStores");
          console.log('response', response);
          // Update the permanent data with the fetched data
          setPermanentData(response.data);
          setFilteredData(response.data)
          // Set dataFetched to true to indicate that data has been fetched
          setDataFetched(true);
          // Cache the fetched data
          localStorage.setItem('cachedData', JSON.stringify(response.data));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [newPlace, filteredData]);
  console.log('permanentData', permanentData);


  useEffect(() => {
  }, [permanentData]
  )
  useEffect(() => {
  }, [isEditMode]
  )


  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);
  };

  const handleCloseForm = (updatedStoreData) => {
    setNewPlace(null)
    setIsEditMode(false);
    const updateData = (data, updatedStoreData) =>
      data && data.map((store) => (store._id === updatedStoreData._id ? updatedStoreData : store));
    const updatedFilteredData = updateData(filteredData, updatedStoreData);
    const updatedPermanentData = updateData(permanentData, updatedStoreData);

    setFilteredData(filteredData ? updatedFilteredData : updatedPermanentData);
    localStorage.setItem('cachedData', JSON.stringify(filteredData ? updatedFilteredData : updatedPermanentData));
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
  };

  const handleCloseFlashMessage = () => {
    setCurrentPlaceId(null)
    setShowFlashMessage(false);
  };

  const moveLocationOnTheFly = async (coordinates, store, flag) => {
    let newLocationCoordinates;
    if (flag === "setNewPositionAfterDrag") {
      newLocationCoordinates = {
        coordinates: [coordinates.lngLat.lng, coordinates.lngLat.lat,
        ],
      };
      // first render, the popup won't show up
      setShowFlashMessage(true);
      setCurrentPlaceId(store._id);
    }
    if (flag === "cancelChangePosition") {
      newLocationCoordinates = originalCoordinates;
      setShowFlashMessage(false);
      setCurrentPlaceId(null);
    }
    // Make the PATCH request to update the store's location
    const id = store._id;
    console.log('showFlashMessage', showFlashMessage);
    try {
      const response = await axios.patch(`/edit-store/${id}`, {
        location: newLocationCoordinates,
      });
      const data = response.data;
      // refilter the data with the updated data
      handleCloseForm(data)
      console.log('data', data);
    } catch (error) {
      console.error('Error updating store location:', error);
    }
  }

  const handleDragEnd = async (e, store) => {
    setOriginalCoordinates(store.location)
    moveLocationOnTheFly(e, store, "setNewPositionAfterDrag")
  };

  const cancelChangePosition = (store) => {
    moveLocationOnTheFly(originalCoordinates, store, "cancelChangePosition")
  }
  console.log("show", showFlashMessage)
  console.log('isOpen', isOpen);

  const handleDataFetched = (data) => {
    setDataFetched(data)
  };

  console.log('dataFetched', dataFetched);
  console.log('currentPlaceId', currentPlaceId);

  let dblClick = false;

  const handleDblClick = () => {
    console.log('dblClick');
    dblClick = true
  };

  const handleAddClick = (e) => {
    dblClick = false;
    setTimeout(() => {
      if (!dblClick) {
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
      }
    }, 220)
  };

  const mapData = filteredData?.length >= 0 && filteredData?.length < permanentData?.length ? filteredData : permanentData

  const [dataFromCsv, setDataFromCsv] = useState(null)
  const handleDataFromChild = (data) => {
    setDataFromCsv(data)
  }
  console.log('dataFromCsv', dataFromCsv);

  useEffect(() => {

  }, [dataFromCsv])

  const handleOnCloseCsvModal = () => {
    alert("here")
  }

  // const examplePoints = [
  //   { location: { coordinates: [-117, 48] }, address: 'Point 1' }
  // ];

  // const [simulatedGPS, setSimulatedGPS] = useState([]);
  // useEffect(() => {
  //   setSimulatedGPS(examplePoints);
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     animateGPS();
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [simulatedGPS]);

  // const animateGPS = () => {
  //   setSimulatedGPS((prevPoints) => {
  //     return prevPoints.map((point) => ({
  //       ...point,
  //       location: {
  //         coordinates: [
  //           parseFloat(point.location.coordinates[0]) + 10,
  //           parseFloat(point.location.coordinates[1]) + 10,
  //         ],
  //       },
  //     }));
  //   });
  // };


  return (
    <>
      {/* <div className="flex flex-row flex-wrap m-2">
        <Dropdown
          sendDataFromDropdown={dataFromDropdown}
          dataFromParent={mapData}
          permanentDataFromParent={permanentData}
          sendFieldsDataFromDropdown={handleInputDataFromDropdown}
        ></Dropdown>
        <SearchBar
          func={pullData}
        ></SearchBar>
      </div> */}

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
              dataFetched={handleDataFetched}
            ></Select>
          </div>
        </div>
        <ReactMapGL
          {...viewport}
          mapboxAccessToken="pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ"
          style={{ width: "100%", height: "100%" }}
          mapStyle={showStreet ? "mapbox://styles/mapbox/streets-v11" : "mapbox://styles/mapbox/satellite-v9"}
          onMove={(evt) => setViewport(evt.viewState)}
          onViewportChange={(newViewport) => setViewport(newViewport)}
          onClick={handleAddClick}
          onDblClick={handleDblClick}
          ref={mapRef}
        >
          {
            mapData?.map((store, index) => (
              <>
                <Marker
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, store)}
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
                {/* {simulatedGPS.map((point, index) => (
        <Marker
          key={index}
          latitude={parseFloat(point.location.coordinates[1])}
          longitude={parseFloat(point.location.coordinates[0])}
          offsetLeft={-20}
          offsetTop={-20}
        >
          <div className="custom-marker">🚗</div>
        </Marker>))} */}
                {store._id === currentPlaceId && !showFlashMessage && (
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
                    showFlashMessage={showFlashMessage}
                  >
                  </CustomPopup>
                )}
                {store._id === currentPlaceId && showFlashMessage && (
                  <FlashMessage message="Your message here"
                    storeName={store._id}
                    onClose={handleCloseFlashMessage}
                    latitude={store.location.coordinates[1]}
                    longitude={store.location.coordinates[0]}
                    currentPlaceId={currentPlaceId}
                    onCancel={() => cancelChangePosition(store)}
                  />
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
                    dataFetched={handleDataFetched}
                    dataFromCsv={dataFromCsv}
                  ></SimpleInput>
                </div>
              </Popup>
            </>
          )}
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <NavigationControl />
          </div>
          <div className="p-2 bg-white rounded" style={{ position: 'absolute', bottom: 50, right: 10 }}>
            <button onClick={switchToSatelliteView}>
              Switch to Satellite View
            </button>
          </div>

        </ReactMapGL>
        <ConvertCsvToJson
          sendDataFromChild={handleDataFromChild}
        >Here</ConvertCsvToJson>
        <FullTable
          key={store._id}
          closeButton={true}
          closeOnClick={false}
          onClose={() => closePopup()}
          anchor="none"
          isOpen={true}
          sendDataFromModal={receiveDataFromModal}
          dataFromParent={store}
          loading={loading}
          handleEditClick={handleEditClick}
          isEditMode={isEditMode}
          showFlashMessage={showFlashMessage}
        >
          <GeoJsonEditor
            dataFromCsv={dataFromCsv}
            onClose={handleOnCloseCsvModal}
          >
          </GeoJsonEditor>
        </FullTable>
        
      </div>

    </>
  );
};
export default DisplayMap;