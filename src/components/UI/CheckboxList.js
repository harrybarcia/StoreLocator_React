import React, { useEffect, useState } from 'react';
import axios from 'axios';


function CheckboxList(props) {

  const [results, setResults] =useState(null)
  
  const items = results?.map(item => ({ city: item.city, address:item.address }));
  console.log(items);


  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/allStores`);
      setResults(result.data);
    };
    fetchData();
  }, []);
  console.log(results)
  
  const reducedData = {};
  
  items?.forEach((item) => {
    for (const key in item) {
      if (!reducedData[key]) {
        reducedData[key] = new Set();
      }
      reducedData[key].add(item[key]);
    }
  });
  
  // Convert Sets to arrays
  for (const key in reducedData) {
    reducedData[key] = Array.from(reducedData[key]);
  }
  
  console.log(reducedData);

  const [selectedValues, setSelectedValues] = useState({});

  const handleChange = (key, selectedValue) => {
    setSelectedValues({
      ...selectedValues,
      [key]: selectedValue,
    });
  };
  console.log(selectedValues)


    // Apply filters based on selected values
    const filteredItems = items?.filter((item) =>
    Object.keys(selectedValues).every((key) =>
      selectedValues[key] === '' || item[key] === selectedValues[key]
    )
  );
  useEffect(() => {
    props.sendFilteredItemsFromCheckboxList(filteredItems)
  }, [selectedValues])
  console.log(filteredItems)

  return (
    <div className=" relative flex justify-center m-2">
    {Object.keys(reducedData).map((key) => (
      <div key={key}>
        <label htmlFor={key}>{key}:</label>
        <select
          id={key}
          onChange={(e) => handleChange(key, e.target.value)}
        >
          <option value="">Select {key}</option>
          {reducedData[key].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>
  );
}

export default CheckboxList;
