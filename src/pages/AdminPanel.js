import React, { useState, useEffect } from 'react';
import axios from "axios";
import { fetchFields } from './Fields';
import { Navigate, useNavigate } from "react-router-dom";
import { Checkbox } from '@mui/material';

const AdminPanel = () => {
  const [fields, setFields] = useState([]);
  const [newFields, setNewFields] = useState([]);
  const [allFieldsTogether, setAllFieldsTogether] = useState([fields])
  const [checkboxValues, setCheckboxValues] = useState(Array(allFieldsTogether.length).fill(false))
  const mySettings = ["visibility", "isFilter"];
  const [checkboxStates, setCheckboxStates] = useState(Array(mySettings.length).fill(false));
  const [checkboxMatrix, setCheckboxMatrix] = useState(Array(allFieldsTogether.length).fill(Array(mySettings.length).fill(false)));
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      const data = await fetchFields();
      setFields(data); // Update the state with the fetched data
    };

    fetchData();
  }, []); // Empty dependency array to run the effect once when the component mounts  

  console.log(fields)



  useEffect(() => {
    setAllFieldsTogether([...fields, ...newFields]);
  }, [fields, newFields])

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
  

  console.log(checkboxMatrix)
  const handleChangeCheckbox = (rowIndex, colIndex) => {
    console.log(rowIndex,":", colIndex)
    console.log(checkboxMatrix[rowIndex][colIndex])
    setCheckboxMatrix((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      newMatrix[rowIndex][colIndex] = !newMatrix[rowIndex][colIndex];
      return newMatrix;
    });
  };
  console.log(checkboxMatrix)

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
    console.log('Data saved:', results.data);
    navigate("/");
  }
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');
  const handleAddInputField = () => {
    const newFields = {
      key: newFieldName,
      value: newFieldType,
      visibility:"false"
    };
    setNewFields(prevFields => [...prevFields, newFields]);
    setNewFieldName('');
    setNewFieldType('');
  };
  console.log(allFieldsTogether)

  return (
    <>
      <div className="flex flex-col items-center justify-center  bg-white p-8 rounded shadow-md">
        <form onSubmit={handleSubmit} >
            {
              allFieldsTogether.map((field, fieldIndex) => {
                const key = field.key;
                const fieldName = `${key}-${fieldIndex}`;
                const visibility = field.flagVisibility
                return (
                  <div className="mb-4 flex flex-row " key={fieldIndex}>
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
                    <div className='flex flex-row'>
                      {
                        mySettings.map((item, index) => {
                          return (
                            <div key={fieldIndex[index]}>
                              <label className="text-gray-600 font-medium">{item}</label>
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
                  </div>
                );
              })
            }
          <button type="submit">Submit</button>
        </form>
        <div className="max-w-md flex flex-col items-center justify-center  bg-white p-8 rounded shadow-md flex flex-col">
          <input
            type="text"
            placeholder="Enter new field name"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
          />
          <select
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value)}
          >
            <option value="String">string</option>
            <option value="Number">number</option>
            <option value="Boolean">boolean</option>
          </select>

          <button onClick={handleAddInputField}>Add new field</button>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
