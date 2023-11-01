import React, { useState, useEffect } from 'react';
import axios from "axios";

const AdminPanel = () => {
  const [fields, setFields] = useState([]);
  const [newFields, setNewFields] = useState([]);
  const [allFieldsTogether, setAllFieldsTogether] = useState([])

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get('/fields'); // Use the correct API endpoint URL
        // Array to store the transformed data
        const transformedData = response.data.map(obj => {
          const types = Object.entries(obj.type);
          // Assuming each object has only one type
          const [key, value] = types[0];
          return { key, value };
        });
        setFields(transformedData)
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };

    fetchFields(); // Call the fetchFields function when the component mounts
  }, []); // Empty dependency array to ensure it runs only once when the component mounts
  console.log(fields)
  useEffect(() => {
    setAllFieldsTogether([...fields, ...newFields]);
  }, [fields, newFields])

  

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const results = await axios.post('/add-field', newFields)
    console.log('Data saved:', results.data);
  }
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');
  const handleAddInputField = () => {
    const newFields = {
      key: newFieldName,
      value: newFieldType,
    };
    setNewFields(prevFields => [...prevFields, newFields]);
    setNewFieldName('');
    setNewFieldType('');
  };
  console.log(allFieldsTogether)
  return (
    <>
      <div className="max-w-md w-full flex items-center justify-center  bg-white p-8 rounded shadow-md">
        <form onSubmit={handleSubmit} >
            {
              allFieldsTogether.map((field, index) => {
                const key = field.key;
                const fieldName = `${key}-${index}`;
                return (
                  <div className="mb-4" key={index}>
                    <label className="block text-gray-600 font-medium">{key}</label>
                    <select
                      id={fieldName}
                      name={fieldName}
                      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
                      defaultValue={field.value}
                    >
                      <option value="String">String</option>
                      <option value="Boolean">Boolean</option>
                      <option value="Number">Number</option>
                    </select>
                  </div>
                );
              })
            }
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="max-w-md w-full flex items-center justify-center  bg-white p-8 rounded shadow-md">
        <input
          type="text"
          placeholder="Enter new field name"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
        />
        <select
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"
          value={newFieldType}
          onChange={(e) => setNewFieldType(e.target.value)}
        >
          <option value="String">string</option>
          <option value="Number">number</option>
          <option value="Boolean">boolean</option>
        </select>

        <button onClick={handleAddInputField}>Add new field</button>
      </div>
    </>
  );
};

export default AdminPanel;
