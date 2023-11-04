

import React, { useState, useEffect } from 'react';
import axios from "axios";

export const fetchFields = async () => {
    try {
      const response = await axios.get('/fields'); // Use the correct API endpoint URL
      // Array to store the transformed data
      const transformedData = response.data.map(obj => {
        const types = Object.entries(obj.type);
        // Assuming each object has only one type
        const [key, value] = types[0];
        return { key, value };
      });
      return transformedData
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };
