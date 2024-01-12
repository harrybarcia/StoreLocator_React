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
  minWidth: '80%',
  maxWidth: '1440px',
  height: '100%',
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
            <Box sx={style}
              className="flex flex-col justify-between"
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
                <img
                  src={`images/${store.image}`}
                  alt="Image"
                  style={{
                    width: '100%',
                    maxHeight: "40%",
                    objectFit: 'cover',  // Choose 'contain' or 'cover' based on your preference
                  }}
                  onLoad={handleImageLoad}

                />
              )}
              {isImageLoaded && !isEditMode && (
                <div>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    <br></br>
                  </Typography>
                  <div>
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
                  </div>
                </div>
              )}
              {isImageLoaded && isEditMode && (
                <div>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    <br></br>
                  </Typography>
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

            </Box>
          </Modal>
    </div >
  );
}