import React, { useState, useEffect } from 'react';
import axios from "axios";

const AdminPanel = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get('/fields'); // Use the correct API endpoint URL
        // Array to store all types
        const allTypes = [];

        // Loop through the objects and extract the types
        for (const obj of response.data) {
            const typeObject = obj.type;
            const types = Object.keys(typeObject);

            // Add the types to the array
            allTypes.push(...types);
        }

        console.log(allTypes);
        setFields(allTypes)
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };

    fetchFields(); // Call the fetchFields function when the component mounts
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  useEffect(() => {

  }, [fields])
  console.log("[{key: 'test', value: 'Number'} ]")
  console.log("fields", fields) // Output:[{key: 'test', value: 'Number'} ]
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const results = await axios.post('/add-field', fields)
    console.log('Data saved:', results.data);
  }

  fields.map((field, index) => {
    console.log(field.value, index)
  })

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');

  const handleAddInputField = () => {
    const newField = {
      key: newFieldName,
      value: newFieldType,
    };
    console.log(newField)

    setFields([...fields, newField]);
    setNewFieldName('');
    setNewFieldType('');
  };

  return (
    <>
      <div className="max-w-md w-full flex items-center justify-center  bg-white p-8 rounded shadow-md">
        <form onSubmit={handleSubmit} >
            {
              fields.map((field, index) => {
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
