import * as React from 'react';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SimpleInput from "../../pages/NewStoreForm";
import DoneIcon from '@mui/icons-material/Done';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '90%',
  maxWidth: '1440px || 80%',
  height: '95%',
  backgroundColor: '#fff',
  boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.24)',
  padding: '0px',
  overflow: 'auto', // Change 'hidden' to 'auto' to allow scrolling  
};

export default function CustomPopup(props) {

  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(props.isEditMode);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [imageStyle, setImageStyle] = useState({ display: 'none' });


  console.log("onpopup")
  const handleClose = () => {
    setOpen(false)
    props.sendDataFromModal(false)
  }

  const store = props.dataFromParent
  useEffect(() => {
    setOpen(props.isOpen)
    setIsEditMode(props.isEditMode)
  }, [props.isOpen, props.isEditMode])

  useEffect(() => {
  }
    , [isEditMode, filteredData])

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setLoading(false); // Set loading to false once the image is loaded
    setImageStyle({ ...imageStyle, display: 'block' });

  }
  const handleCloseForm = (updatedStoreData) => {
    setNewPlace(null)
    setIsEditMode(false);
    const updatedFilteredData = filteredData.map((store) => {

      // Check if the store matches the updatedStoreData
      if (store._id === updatedStoreData.data.data._id) {
        // Replace the matching store with the updated data
        return updatedStoreData.data.data;
      }
      // If it doesn't match, keep the store as is
      return store;
    });
    setFilteredData(updatedFilteredData);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setNewPlace(null)
  };

  const handleSaveClick = () => {
    setIsEditMode(false);
  };
  console.log('props.showFlashMessage', props.showFlashMessage);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: 'auto' }}
      >
        <div>

          <Box sx={style}
            className="flex flex-col h-full justify-between items-center"
          >
            {!isImageLoaded && (
              <div
                className="flex items-center justify-center h-screen"
              >
                <CircularProgress
                  color="primary"
                  size={64}  // Adjust the size as needed
                />

              </div>
            )}

            {!loading && (
              <div className="relative" style={{ width: '100%', maxHeight: "40%", objectFit: 'cover' }}>
                <div className="absolute inset-x-0 bottom-0 text-gray-700 font-sans font-normal text-base leading-5 select-none whitespace-normal text-center box-border max-h-1/3">
                  <h1 className="font-'EDF 2020', sans-serif select-none box-border mb-2 font-normal text-3xl lg:text-5xl leading-1 text-white ">
                    {store.address}
                  </h1>
                  <ul className="text-white list-disc list-inside mb-5 text-xl">
                    <li>2025</li>
                    <li>
                      {store.city}, {store.typeObject.map((item, index) => {
                        if (item.key === "Countries") {
                          const countryName = item.data[0].name;
                          return countryName;
                        }
                        return null; // or an empty string if you want to render nothing for other items
                      })}
                    </li>

                  </ul>
                </div>
                <img
                  src={`images/wind-project-header-1440x420.jpg `}
                  alt="Image"
                  style={{ width: '100%', maxHeight: "100%", minHeight:"240px", objectFit: 'cover', ...imageStyle}}
                  onLoad={handleImageLoad}
                />
              </div>

            )}
            {isImageLoaded && !isEditMode && (
              <div>
                <div className="flex flex-col h-full mt-0">
                  <div className="flex-grow"><strong>Address: </strong>{store.address}</div>
                  <div className="flex-grow"><strong>City:</strong> {store.city}</div>
                  {
                    store.typeObject.map((item, index) => ( item?.data &&
                      <div key={index} className="mb-auto">
                        <strong>{item?.key}</strong> : {item?.data[0].name}
                      </div>
                    ))
                  }

                </div>


              </div>
            )}
            {isImageLoaded && isEditMode && (
              <div>
                <div>
                  <div >

                    <a
                      style={{
                        color: '#fff',
                        display: 'block',
                        fontSize: '36px',
                        position: 'absolute',
                        top: 0,
                        right: "72px",
                        width: '72px',
                        height: '72px',
                        textAlign: 'center',
                        transition: 'background-color 0.6s',
                      }}>
                      <EditIcon
                        style={{ fontSize: '34px' }}
                        onClick={props.handleEditClick}>
                      </EditIcon>
                    </a>
                    <a
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        display: 'block',
                        fontSize: '36px',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '72px',
                        height: '72px',
                        textAlign: 'center',
                        transition: 'background-color 0.6s',
                      }}>
                      <CloseIcon
                        style={{ fontSize: '48px' }}
                        onClick={handleClose}
                      />
                    </a>
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
                <div
                  style={{
                    height: '20%',  // Set the desired height
                    width: '100%',
                    backgroundColor: "#10367A",
                    marginBottom: 0,
                    minHeight: "100px"
                  }}
                >
                </div>
              </div>
            )}

            <div >
              <a
                style={{
                  color: '#fff',
                  display: 'block',
                  fontSize: '36px',
                  position: 'absolute',
                  top: 0,
                  right: "72px",
                  width: '72px',
                  height: '72px',
                  textAlign: 'center',
                  transition: 'background-color 0.6s',
                }}>
                <EditIcon
                  style={{ fontSize: '34px' }}
                  onClick={props.handleEditClick}>
                </EditIcon>
              </a>
              <a
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  color: '#fff',
                  display: 'block',
                  fontSize: '36px',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '72px',
                  height: '72px',
                  textAlign: 'center',
                  transition: 'background-color 0.6s',
                }}>
                <CloseIcon
                  style={{ fontSize: '48px' }}
                  onClick={handleClose}
                />
              </a>
            </div>

            <div
              style={{
                height: '20%',  // Set the desired height
                width: '100%',
                backgroundColor: "#10367A",
                marginBottom: 0,
                minHeight: "100px"
              }}
            ></div>
          </Box>
        </div>
      </Modal>
    </div >
  );
}