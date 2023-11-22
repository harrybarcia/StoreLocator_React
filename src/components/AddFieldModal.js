import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function BasicModal({ modal, openParent, newFieldName, newFieldType, onChangeFieldName, onChangeFieldType, onAddInputField }) {
    const [open, setOpen] = useState(false);

    console.log(modal)
    const handleClose = () => {
        setOpen(false);
    };

    const handleAddInputField = () => {
        // Send data to the parent component
        onAddInputField();

        // Update open state to close the modal
        setOpen(false);
    };
    return (
        <div>
            <button type="button"
                      className=' mt-8'
                      >
                <AddCircleOutlineIcon onClick={() => setOpen(true)}></AddCircleOutlineIcon>
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {modal === "fieldModal" && (
                        <div className="max-w-md flex items-center justify-center  bg-white p-8 rounded shadow-md flex flex-row mr-1">
                            <input
                                type="text"
                                placeholder="Enter new field name"
                                value={newFieldName}
                                onChange={(e) => onChangeFieldName(e.target.value)}
                            />
                            <select
                                className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                                value={newFieldType}
                                onChange={(e) => onChangeFieldType(e.target.value)}
                            >
                                <option value="String">string</option>
                                <option value="Number">number</option>
                                <option value="Boolean">boolean</option>
                            </select>
                            <button onClick={handleAddInputField}>Add new field</button>
                        </div>
                    )}
                    {modal === "dataModal" && (
                        <div className="max-w-md flex items-center justify-center  bg-white p-8 rounded shadow-md flex flex-row mr-1">
                            <input
                                type="text"
                                placeholder="Enter Data"
                                value={newFieldName}
                                onChange={(e) => onChangeFieldName(e.target.value)}
                            />
                            <button onClick={handleAddInputField}>Add data to your field </button>
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
