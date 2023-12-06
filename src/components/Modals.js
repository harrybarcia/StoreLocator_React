import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import ModalColorPicker from "../components/ModalColorPicker"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function BasicModal({ myField, modal, newFieldName, newFieldType,newFieldDataName, onChangeFieldName, onChangeFieldType, onAddInputField, onAddInputDataField }) {
    const [open, setOpen] = useState(false);
    const [openData, setOpenData] = useState(false);
    const [inputDataField, setInputDataField] = useState([]);
    const [newInputDataFieldName, setInputDataFieldName] = useState('');
    const [isEditIcon, setIsEditIcon] = useState([])
    const [isDoneIcon, setIsDoneIcon] = useState([])
    const [newColor, setNewColor] = useState()
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        // Assuming you want to fill isEditIcon with 'false' for each element
        const newIsEditIcon = Array(inputDataField.length).fill(true);
        const newIsDoneIcon = Array(inputDataField.length).fill(false);
        setIsDoneIcon(newIsDoneIcon);
        setIsEditIcon(newIsEditIcon);
    }, [inputDataField]);
    console.log(isEditIcon)
    console.log(isDoneIcon)


    useEffect(() => {
    }, [isEditIcon, isDoneIcon, inputDataField])

    const handleAddInputField = () => {
        console.log(inputDataField)

        // Send data to the parent component
        onAddInputField();
        // Update open state to close the modal
        setOpen(false);
    };
    const handleAddInputsDataField = () => {
        console.log(inputDataField)
        // Send data to the parent component

        onAddInputDataField(inputDataField, myField);
        // Update open state to close the modal
        setOpenData(false);
    };


    
    const handleAddInputDataField = () => {
        const newInputDataField = [...inputDataField, newInputDataFieldName, newColor]
        setInputDataField(newInputDataField)
        setOpenData(false)
        setInputDataFieldName('')
    };
    const handleRemoveInputDataField = (item) => {
        const newInputDataField = [...inputDataField]
        const inputRemoved = newInputDataField.filter((itemInArray) => itemInArray != item)
        console.log(inputRemoved)
        setInputDataField(inputRemoved)

    };
    console.log(inputDataField)

    const onChangeInputDataFieldName = (item) => {
        setInputDataFieldName(item)
    }
    console.log(newInputDataFieldName)

    const handleClickIcon = (index) => {
        setIsEditIcon((prevIsEditIcon) => {
            const updatedIsEditIcon = [...prevIsEditIcon];
            updatedIsEditIcon[index] = !updatedIsEditIcon[index];
            return updatedIsEditIcon;
        });
    };
    inputDataField.map((item, index) => {
        console.log(item)
    })
    const handleChangeColor = (color) => {
        setNewColor(color)
    }

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
                <div>
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
                            <div>
                                {inputDataField.map((item, index) => (
                                    <div className='flex justify-between'>
                                        <div key={index}>{item}</div>
                                        <div className='flex justify-between' >
                                            <button onClick={() => handleClickIcon(index)}>
                                                {item ? <EditIcon /> : <DoneIcon />}
                                            </button>
                                            <button onClick={(e) => handleRemoveInputDataField(item, index)}>
                                                <RemoveCircleOutlineIcon />
                                            </button>
                                        </div>
                                    </div>

                                ))}
                                <div className="max-w-md flex items-center justify-center  bg-white p-8 rounded shadow-md flex flex-row mr-1">
                                    <input
                                        type="text"
                                        placeholder="Enter Data"
                                        value={newInputDataFieldName}
                                        onChange={(e) => onChangeInputDataFieldName(e.target.value)}
                                    />
                                    <ModalColorPicker
                                    sendColorFromModal={handleChangeColor}
                                    ></ModalColorPicker>
                                    <button><AddCircleOutlineIcon onClick={(e) => handleAddInputDataField(e)}></AddCircleOutlineIcon> </button>
                                    <button onClick={() => handleAddInputsDataField()}>Add filter Data to the field</button>
                                </div>
                            </div>
                        )}
                    </Box>
                </div>
            </Modal>
        </div>
    );
}
