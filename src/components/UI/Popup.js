import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "50%",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
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
        <Box sx={style}>
          {loading && (
            <CircularProgress color="primary" />
          )}
          {!loading && (
            <div>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 20 }}>
              <img src={`images/${store.image}`} alt="Mountain Landscape" className="w-full" />
              </Typography>
            </div>
          )}
          {!loading && (
         <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 20 }}>
          {store.city}
         </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}
