

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
        const visibility = obj.visibility
        const isFilter = obj.isFilter
        const id = obj._id
        const order = obj.order
        return {id, key, value, visibility, isFilter, order };
      });
      return transformedData
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

