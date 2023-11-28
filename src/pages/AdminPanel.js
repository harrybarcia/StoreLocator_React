import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { fetchFields } from './fetchFields';
import { Navigate, useNavigate } from "react-router-dom";
import { Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SuppressionModal from '../components/SuppressionModal';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import BasicModal from '../components/AddFieldModal';


const AdminPanel = () => {
  const [fields, setFields] = useState([]);
  const [newFields, setNewFields] = useState([]);
  const [newDataFields, setNewDataFields] = useState([]);
  const [allFieldsTogether, setAllFieldsTogether] = useState([fields])
  const [checkboxValues, setCheckboxValues] = useState(Array(allFieldsTogether.length).fill(false))
  const mySettings = ["visibility", "isFilter"];
  const [checkboxStates, setCheckboxStates] = useState(Array(mySettings.length).fill(false));
  const [checkboxMatrix, setCheckboxMatrix] = useState(Array(allFieldsTogether.length).fill(Array(mySettings.length).fill(false)));
  const [showModal, setShowModal] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [nextOrder, setNextOrder] = useState(1); // Initial order
  const [open, setOpen] = useState(null);

  console.log(fieldToDelete)

  const navigate = useNavigate();

  // Fetch data when the component mounts
  const fetchData = async () => {
    const data = await fetchFields();
    const maxOrder = Math.max(...data.map((field) => field.order), 0);
    setNextOrder(maxOrder + 1);
    setFields(data); // Update the state with the fetched data
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run the effect once when the component mounts  

  useEffect(() => {
    setNewDataFields(fields.map((item) => item.data))
  }, [fields])

  console.log(newDataFields)

  useEffect(() => {
    setAllFieldsTogether([...fields, ...newFields]);
  }, [fields, newFields])

  console.log(fields)
  useEffect(() => {

  }, [allFieldsTogether])

  useEffect(() => {
    setCheckboxMatrix((prevMatrix) => {
      const newMatrix = Array.from({ length: allFieldsTogether.length }, () =>
        Array(mySettings.length).fill(false)
      );

      allFieldsTogether.forEach((field, fieldIndex) => {
        mySettings.forEach((setting, index) => {
          // Check if the field has the setting property and if its value is truthy
          const fieldValue = field[setting];
          newMatrix[fieldIndex][index] = fieldValue ? true : false;
        });
      });

      return newMatrix;
    });
  }, [allFieldsTogether]);


  const handleChangeCheckbox = (rowIndex, colIndex) => {
    setCheckboxMatrix((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      newMatrix[rowIndex][colIndex] = !newMatrix[rowIndex][colIndex];
      return newMatrix;
    });
  };
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const updatedFields = allFieldsTogether.map((field, fieldIndex) => {
      const updatedProperties = mySettings.reduce((acc, setting, index) => {
        const checkboxValue = checkboxMatrix[fieldIndex]?.[index] || false;
        return { ...acc, [setting]: checkboxValue };
      }, {});

      return {
        ...field,
        ...updatedProperties,
      };
    });

    const results = await axios.post('/add-field', updatedFields)
    navigate("/");
  }
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');
  const handleAddInputField = () => {
    console.log('here')
    const newFields = {
      key: newFieldName,
      value: newFieldType,
      visibility: "false",
      order: nextOrder, // Use the current order
      data:[]
    };
    setNewFields(prevFields => [...prevFields, newFields]);
    setNextOrder((prevOrder) => prevOrder + 1);
    setNewFieldName('');
    setNewFieldType('');
  };

  const handleAddInputDataField = (inputDataField, id) => {
    setAllFieldsTogether((prevDataFields) => {
      // Use map to iterate through allFieldsTogether and update the item with the matching id
      const updatedAllFieldsTogether = prevDataFields.map((field) =>
        field.id === id ? { ...field, data: inputDataField } : field
      );
  
      return updatedAllFieldsTogether;
    });
  };
  console.log(allFieldsTogether)
  
  console.log("newDataFields", newDataFields )
  console.log("allFieldsTogether", allFieldsTogether)

  const handleDeleteField = async (fieldToDelete) => {
    setShowModal(false);
    try {
      const response = await axios.delete(`delete-fields/${fieldToDelete}`);
      console.log(response);
      fetchData();
    } catch (error) {
      // Handle error
    }
  };

  const dragItem = useRef(null)
  const dragOverItem = useRef(null)
  const handleSort = () => {
    // duplicate items
    let _allFieldsTogether = [...allFieldsTogether]
    // remove and save the dragegd item content
    console.log(dragItem.current)
    // remove 1 element starting from index dragItem.current
    const draggedItemContent = _allFieldsTogether.splice(dragItem.current, 1)[0]
    // if i drag the item at index 2, [item1, item2, item3] becomes [item1, item2]
    // swith the position
    // Remove 0 element at index dragOverItem.current, and insert draggedItemContent
    _allFieldsTogether.splice(dragOverItem.current, 0, draggedItemContent)
    // Update the order property for each item
    _allFieldsTogether = _allFieldsTogether.map((item, index) => ({
      ...item,
      order: index, // Assuming order starts from 1
    }));
    // reset the position ref
    dragItem.current = null
    dragOverItem.current = null
    // update the actual Array
    setAllFieldsTogether(_allFieldsTogether)
  }
  console.log("newFieldName", newFieldName)
  console.log(open)
  return (
    <>
      <div className="flex flex-col items-center justify-center  bg-white p-8 rounded shadow-md">
        <form onSubmit={handleSubmit}
          className='w-auto '
        >
          <div
            className='list-container'
          >
            {
              allFieldsTogether.map((field, fieldIndex) => {
                const key = field.key;
                const fieldName = `${key}-${fieldIndex}`;
                const visibility = field.flagVisibility
                return (
                  <div className="mb-4 flex flex-row border-2 p-2 bg-slate-50 rounded cursor-move	"
                    key={fieldIndex}
                    draggable
                    onDragStart={(e) => dragItem.current = fieldIndex}
                    onDragEnter={(e) => dragOverItem.current = fieldIndex}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <DensityMediumIcon
                      className='mt-7 mr-2'
                    ></DensityMediumIcon>
                    <div className='mr-8'>
                      <label className="block text-gray-600 font-medium">{key}</label>
                      <select
                        id={fieldName}
                        name={fieldName}
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                        defaultValue={field.value}>
                        <option value="string">String</option>
                        <option value="boolean">Boolean</option>
                        <option value="number">Number</option>
                      </select>
                    </div>
                    <div>
                      <div className='overflow-auto max-h-16 mr-2'>
                    {field?.data?.map((item, index) => {
                      return (
                        <div key={`${fieldIndex}-${index}`} className='mx-4'>
                        {item}
                      </div>
                      )
                      })}
                      </div>
                    </div>
                    <BasicModal
                      myField = {field.id}
                      onChangeFieldName={setNewFieldName}
                      onChangeFieldType={setNewFieldType}
                      onAddInputField={handleAddInputField}
                      onAddInputDataField={handleAddInputDataField}
                      newFieldName={newFieldName}
                      newFieldType={newFieldType}
                      openParent={open}
                      modal={"dataModal"}
                    ></BasicModal>
                    <div className='flex flex-row'>
                      {
                        mySettings.map((item, index) => {
                          return (
                            <div key={fieldIndex[index]}>
                              <i className='fa-solid fa-bars'></i>
                              <label className="text-gray-600 font-medium flex flex-col mr-1">{item}</label>
                              <Checkbox
                                id={`${fieldIndex}-${index}`}
                                name={field.key}
                                checked={checkboxMatrix[fieldIndex] ? checkboxMatrix[fieldIndex][index] : false}
                                onChange={() => handleChangeCheckbox(fieldIndex, index)}
                              ></Checkbox>
                            </div>
                          )
                        })
                      }
                    </div>
                    <button type="button"
                      className='ml-4 mt-6'
                      onClick={() => setFieldToDelete(field.id)}
                    >
                      <DeleteIcon onClick={() => setShowModal(true)}></DeleteIcon>
                    </button>
                    <SuppressionModal
                      open={showModal}
                      onClose={() => setShowModal(false)}
                      onDelete={() => handleDeleteField(fieldToDelete)}
                      modalContent="deleteField"
                    />
                  </div>
                );
              })
            }
          </div>
        <BasicModal
          onChangeFieldName={setNewFieldName}
          onChangeFieldType={setNewFieldType}
          onAddInputField={handleAddInputField}
          onAddInputDataField={handleAddInputDataField}
          newFieldName={newFieldName}
          newFieldType={newFieldType}
          openParent={open}
          modal={"fieldModal"}
        ></BasicModal>
        <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default AdminPanel;
