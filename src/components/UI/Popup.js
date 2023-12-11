import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '90%',
  height: '90vh',
  backgroundColor: '#fff',
  boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.24)',
  padding: '0px',
  overflow: 'auto', // Change 'hidden' to 'auto' to allow scrolling  
};



export default function CustomPopup(props) {
  const [open, setOpen] = React.useState();
  const [loading, setLoading] = React.useState(false);

  console.log(props.dataFromParent);
  const store = props.dataFromParent

  useEffect(() => {
    setOpen(props.isOpen);
  }, []);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const retrieveData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        props.sendDataFromModal(open, data);
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    if (open) {
      retrieveData();
    }
  }, [open]);

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
          {loading && (
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
            <div
              style={{
                backgroundImage: `url('images/${store.image}')`,  // Assuming `store.image` contains the image filename or path
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '50%',  // Set the desired height
                width: '100%',
                minHeight:"30%"
              }}
            >
              {/* Your other content */}
            </div>

          )}
          {!loading && (
            <Typography id="modal-modal-title" variant="h6" component="h2">

              <br></br>
              {store.typeObject ? (

                // JSX code to render when store.typeObject.About is truthy
                <div className="p-4">About:<br></br>
                  {store.typeObject[1].data}</div>
              ) : (
                // JSX code to render when store.typeObject.About is falsy
                <div>{store.city}</div>
              )}
            </Typography>
          )}
          <div
            style={{
              height: '20%',  // Set the desired height
              width: '100%',
              backgroundColor: "#10367A",
              marginBottom: 0,
              minHeight:"15%"
            }}
          >
            {/* Your other content */}
          </div>
          <a style={{
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

        </Box>
      </Modal>
    </div >
  );
}
