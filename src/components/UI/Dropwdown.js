import React, { useEffect } from 'react';
import { useState } from'react';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Checkbox from '@mui/material/Checkbox';

const Dropdown = (props) => {
  const [isOpen, setIsOpen] = React.useState([true, false]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [filteredData, setFilteredData] = useState(props.dataFromParent)
  const [permanentData, setPermanentData] =useState(props.permanentDataFromParent)
  const [isChecked, setIsChecked] = useState();
  const [isCheckedType, setIsCheckedType] = useState([]);
  const [uniqueData, setUniqueData] = useState([])
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedCities, setSelectedCities] = useState()
     // I keep tracks of the changes on filtered and permanent data
  useEffect(() => {
    setFilteredData(props.dataFromParent);
    setPermanentData(props.permanentDataFromParent)
  }, [props.permanentDataFromParent, props.dataFromParent ]);
  console.log(filteredData)
  // I trigger selectStoreWhenClick when isChecked is changed
  useEffect(() => {
    selectStoreWhenClick();
  }, [isCheckedType, selectedValues]);

  useEffect(() => {
  }, [isCheckedType]);
  
  // I create my array of unique cities and set isChecked Array
  // Create an async function to fetch the data from the `/allStores` endpoint.

// Use the fetchData() function in a useEffect hook.
useEffect(() => {
  async function fetchData() {
    try {
      const res = await axios.get('/allStores');
      const data = res.data;
      const uniqueData = data.reduce(
        (accumulator, store) => {
          const city = store.city;
          const address = store.address;

          if (!accumulator[0].includes(city)) {
            accumulator[0].push(city);
          }

          if (!accumulator[1].includes(address)) {
            accumulator[1].push(address);
          }

          return accumulator;
        },
        [[], []]
      );
      console.log(uniqueData)

      
      
      // Create the desired result as an array of arrays
      setUniqueData(uniqueData)

      // Dynamic function to fill each inner array with 'true' values
      function fillArraysWithTrue(data) {
        return data.map(innerArray => {
          return Array.from({ length: innerArray.length }, () => true);
        });
      }
      if (uniqueData) {
        const filledUniqueData = fillArraysWithTrue(uniqueData);
        setIsCheckedType(filledUniqueData)
      }
        // Call the function to fill uniqueData
    } catch (error) {
      // Handle errors
      console.error('Error fetching data:', error);
    }
  }

  fetchData(); // Call the function
}, []);

  console.log(uniqueData)
  console.log("isCheckedType", isCheckedType)
  const selectStoreWhenClick = () => {
    // for each truthy value of my array, i filter the city
    const selectedCities = uniqueData[0]?.filter((city, index) => isCheckedType[0][index]);
    const selectedValues = uniqueData[1]?.filter((address, index) => isCheckedType[1][index])
    setSelectedCities(selectedCities)
    // setSelectedValues(selectedValues)
      const filteredConditions = permanentData?.map((item) => {
        const cityCondition = selectedCities?.includes(item.city);
        const addressCondition = selectedValues.length>0?selectedValues.includes(item.address):permanentData.includes(item.address);
        return [cityCondition, addressCondition];
      });      
      const filteredData = permanentData?.filter((_, index) => {
        const [cityCondition, addressCondition] = filteredConditions[index];
        return cityCondition && addressCondition;
      });
      
    props.sendDataFromDropdown(filteredData);
  };

    const handleCheckboxChange = (typeIndex, itemIndex, item) => {
      console.log(typeIndex, itemIndex, item);
      // Create a copy of the isCheckedType array
      const updatedCheckedType = [...isCheckedType];
      console.log(updatedCheckedType);
      console.log(updatedCheckedType[itemIndex]);
      // Toggle the checked state for the clicked city
      updatedCheckedType[typeIndex][itemIndex] = !updatedCheckedType[typeIndex][itemIndex];
      console.log(updatedCheckedType);
      // Update the state with the new value
      setIsCheckedType(updatedCheckedType);
      
      const updatedSelectedValues = { ...selectedValues }
      if (updatedCheckedType[typeIndex]) {
        updatedSelectedValues[typeIndex] = item;
      } else {
        // If the checkbox is unchecked, remove the value from the selectedValues object
        updatedSelectedValues[typeIndex]=null;
      }
      const selectedValuesArray = Object.values(updatedSelectedValues);  
      setSelectedValues(selectedValuesArray)
    };
    console.log(isCheckedType)
    console.log("selectedValues", selectedValues)

    useEffect(() => {
    }, [isCheckedType])
    
    useEffect(() => {
      setFilteredData(filteredData?.filter((item)=>selectedValues?.includes(item.address)))
    }, [selectedValues, isCheckedType])

    const types = [
      {
        label: 'Cities',
        data: uniqueData[0],
        isCheckedType: isCheckedType[0]
      },
      {
        label: 'Categories',
        data: uniqueData[1],
        isCheckedType: isCheckedType[1]
      },
      // Add more types as needed
    ];

    const toggleIsOpen = (index) => {
      setIsOpen((prevIsOpen) =>
        prevIsOpen.map((value, i) => (i === index ? !value : value))
      );
    };

    console.log("isChecked", isChecked)
    console.log(types[0])
    console.log(types[1])
    
    return (
    <div className="flex flex-row">
      {types.map((type, typeIndex) => (
        <div key={typeIndex}>
          <h3>{type.label}</h3>
          {type?.data?.map((item, itemIndex) => (
            <li key={itemIndex}>
              <Checkbox
                id={itemIndex}
                name={item}
                checked={type.isCheckedType[itemIndex]}
                onChange={() => handleCheckboxChange(typeIndex, itemIndex, item)}
              />
              <label className="ml-2" htmlFor={itemIndex}>
                {item}
              </label>
            </li>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Dropdown;
