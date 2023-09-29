import React, { useState, useEffect } from 'react';
import axios from "axios";

const AdminPanel = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get('/fields'); // Use the correct API endpoint URL
        
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };

    fetchFields(); // Call the fetchFields function when the component mounts
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log("in handle submit")
    
  }

  return (
    <div className="max-w-md w-full flex items-center justify-center  bg-white p-8 rounded shadow-md">
      <form onSubmit={handleSubmit} >
          <div className="mb-4">
              <label  className="block text-gray-600 font-medium">Field1</label>
              <input type="text" id="name" name="name" className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="mb-4">
              <label  className="block text-gray-600 font-medium">Field2</label>
              <input type="email" id="email" name="email" className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:border-blue-500"/>
          </div>
          <div className="flex justify-end">
              <button type="submit" className="custom-button">Submit</button>
          </div>
      </form>
    </div>
  );
};

export default AdminPanel;
