import React, { useState, useEffect } from 'react';
import axios from "axios";

const AdminPanel = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get('/fields'); // Use the correct API endpoint URL
        const fieldsArray = Object.entries(response.data[0]).map(([key, value]) => ({ key, value }));
        setFields(fieldsArray)

      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };

    fetchFields(); // Call the fetchFields function when the component mounts
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  useEffect(() => {

  }, [fields])
  console.log("fields", fields)
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log("in handle submit")
    
  }

  fields.slice(2).map((field, index) => {
    console.log(field.value, index)
  })
  return (
    <div className="max-w-md w-full flex items-center justify-center  bg-white p-8 rounded shadow-md">
      <form onSubmit={handleSubmit} >
          <div>
          {
            fields.slice(2).map((field, index) => {
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
          </div>
        <div className="flex justify-end">
                <button type="submit" className="custom-button">Submit</button>
            </div>
      </form>
    </div>
  );
};

export default AdminPanel;
