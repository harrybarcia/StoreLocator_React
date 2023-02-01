import axios from 'axios';
import { get } from 'mongoose';
import React, { useEffect, useState } from 'react';


const SearchRadius = (props) => {
    console.log("props", props);
    const [radius, setRadius] = useState(1);
    const [results, setResults] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const result = await axios.get(`/api`);
        setResults(result.data);
      };
      fetchData();
    }, []);
      
    const handleRadiusChange = (e) => {
        setRadius(e.target.value);
        console.log("radius", radius);
    }



    
  
  return (
    <div>
      <h1>Search Radius</h1>
       <input type="range"
        min="1"
        max="10"
        value={radius}
        onChange={handleRadiusChange}
        className="slider"
        id="myRange"

       
       
       />
       


    </div>
  );
};

export default SearchRadius;