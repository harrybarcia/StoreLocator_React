import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';

const SuppressionModal = ({ open, onClose, onDelete, modalContent }) => {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
        {modalContent === 'deleteStore' && <p>Are you sure you want to delete this store?</p>}
          {modalContent === 'deleteField' && <p>Are you sure you want to delete this field? <br></br> It will also delete all the data associated to that field</p>}
        </DialogContent>
        <div className="flex justify-end">
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onDelete} color="error">
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default SuppressionModal;
