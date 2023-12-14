import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

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
  console.log(props)
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);


  const handleClose = () => {
    setOpen(false)
    props.sendDataFromModal(false)
  }
  const store = props.dataFromParent
  useEffect(() => {
    setOpen(props.isOpen)
  }, [props.isOpen])

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setLoading(false); // Set loading to false once the image is loaded
  }


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
          {isImageLoaded && (
            <div>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <br></br>
                {store.typeObject ? (
                  // JSX code to render when store.typeObject.About is truthy
                  <div className="p-4">About:<br></br>
                    {store.typeObject[0]?.data}</div>
                ) : (
                  // JSX code to render when store.typeObject.About is falsy
                  <div>{store.city}</div>
                )}
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

        </Box>
      </Modal>
    </div >
  );
}
