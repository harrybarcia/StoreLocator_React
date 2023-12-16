

import React, { useState, useEffect } from 'react';
import axios from "axios";

export const fetchFields = async () => {
    try {
      console.log('here in fetch');
      const response = await axios.get('/fields'); // Use the correct API endpoint URL
      console.log('response', response);

      // Array to store the transformed data
      const transformedData = response.data.map(obj => {
        const types = Object.entries(obj.type);
        console.log('types', types);
        // Assuming each object has only one type
        const [key, value] = types[0];
        const visibility = obj.visibility
        const isFilter = obj.isFilter
        const id = obj._id
        const order = obj.order
        const colors = obj.colors
        return {id, key, value, visibility, isFilter, order, colors };
      });
      return transformedData
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

