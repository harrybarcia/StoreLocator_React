import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Checkbox from '@mui/material/Checkbox';
import { fetchFields } from '../fetchFields'


const Dropdown = (props) => {
  const [isOpen, setIsOpen] = React.useState([false, false, false]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [filteredData, setFilteredData] = useState(props.dataFromParent)
  const [permanentData, setPermanentData] = useState(props.permanentDataFromParent)
  const [isChecked, setIsChecked] = useState();
  const [isCheckedType, setIsCheckedType] = useState([]);
  const [uniqueData, setUniqueData] = useState([])
  const [selectedValues, setSelectedValues] = useState([]);
  const buttonsRef = useRef([]);
  const [fields, setFields] = useState([]);
  const [nextOrder, setNextOrder] = useState(1); // Initial order
  // I keep tracks of the changes on filtered and permanent data
  useEffect(() => {
    setFilteredData(props.dataFromParent);
    setPermanentData(props.permanentDataFromParent)
  }, [props.permanentDataFromParent, props.dataFromParent]);
  // I trigger selectStoreWhenClick when isChecked is changed
  useEffect(() => {
    selectStoreWhenClick(types, isCheckedType);
  }, [isCheckedType]);
  useEffect(() => {
  }, [isCheckedType, selectedValues]);

  // Fetch data when the component mounts
  const fetchData = async () => {
    const data = await fetchFields();
    const maxOrder = Math.max(...data.map((field) => field.order), 0);
    setNextOrder(maxOrder + 1);
    setFields(data); // Update the state with the fetched data
  };
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run the effect once when the component mounts  
  
  // Use the fetchData() function in a useEffect hook.
  useEffect(() => {
    async function fetchData() {
      try {
        // Dynamic function to fill each inner array with 'true' values
        function fillArraysWithTrue(fields) {
          return fields.map(obj => {
            return Array.from({ length: obj.data.length }, () => true);
          });
        }
        const filledUniqueData = fillArraysWithTrue(fields);
        setIsCheckedType(filledUniqueData);        
      } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error);
      }
    }
    fetchData(); // Call the function
  }, [fields]);

  
  const types = fields?.map((obj, index) => ({
    label: obj.key,
    data: obj.data,
    isCheckedType: isCheckedType[index]
  }));
  const selectStoreWhenClick = (types, isCheckedType) => {
    // Inside your component or function
    
        // Inside your component or function
    let tempSelectedValuesArrays = [];
    types?.forEach((item, index) => {
      if (isCheckedType.length>0){
        const selectedValuesForEachItem = item?.data.filter((_item, dataIndex) => isCheckedType[index][dataIndex]);
        // Accumulate changes in the temporary variable
        tempSelectedValuesArrays.push(selectedValuesForEachItem);
      }
    });

    // Update the state variable once after the loop
    const filteredConditions = permanentData?.map((item) => {
      const conditions = types.map((type, index) => {
        const label = type.label;
        const data = type.data;
        const result = data.some(item => tempSelectedValuesArrays[index].includes(item));
        console.log(result)
        console.log("mon types de base a", type.data)
        console.log("ma selection", tempSelectedValuesArrays[index])
        console.log("does my store has this value?:", tempSelectedValuesArrays[index],"?  ", result)
      })
    });    
    props.sendDataFromDropdown(filteredData);
  };

  const handleCheckboxChange = (typeIndex, itemIndex, item) => {

    // Create a copy of the isCheckedType array
    const updatedCheckedType = [...isCheckedType];
    // Toggle the checked state for the clicked city
    updatedCheckedType[typeIndex][itemIndex] = !updatedCheckedType[typeIndex][itemIndex];
    // Update the state with the new value
    setIsCheckedType(updatedCheckedType);
    const updatedSelectedValues = { ...selectedValues }
    if (updatedCheckedType[typeIndex]) {
      updatedSelectedValues[typeIndex] = item;
    } else {
      // If the checkbox is unchecked, remove the value from the selectedValues object
      updatedSelectedValues[typeIndex] = null;
    }
    const selectedValuesArray = Object.values(updatedSelectedValues);
    setSelectedValues(selectedValuesArray)
  };

  useEffect(() => {
  }, [isCheckedType])

  // useEffect(() => {
  //     setFilteredData(filteredData?.filter((item) => {
  //       return types.map((type, typeIndex) => selectedValues[typeIndex]?.includes(item[typeIndex])).every(Boolean);
  //     }));
  // }, [selectedValues, isCheckedType, types]);
    // console.log(isCheckedType)
    // output:[
    //     [
    //       true,
    //       true
    //   ],
    //   [
    //       true
    //   ]
    // ]
    
    // uniqueData 
    // output:
    // [
    //   [
    //       "north",
    //       "Hallein"
    //   ],
    //   [
    //       "455 waterfront roadf"
    //   ]
    // ]
  
  const toggleIsOpen = (index) => {
    setIsOpen((prevIsOpen) =>
      prevIsOpen.map((value, i) => (i === index ? !value : false))
    );
  };

  return (
    <div className="flex flex-row">
      {types.map((type, typeIndex) => (
        <div key={typeIndex}>
          <button
            ref={buttonsRef}
            type="button"
            id = "my-button"
            className="relative flex w-fit rounded-full p-2 mr-12 text-black font-bold z-5 text-lg hover:gray border border-black"
            onClick={() => toggleIsOpen(typeIndex)}>
            <h3>{type.label}</h3>
            {isOpen[typeIndex] ? (
              <ArrowDropDownIcon className="h-8" />
            ) : (
              <ArrowDropUpIcon className="h-8" />
            )}
          </button>
          {isOpen[typeIndex] && (
            <div className="absolute text-black font-bold flex flex-col p-2 w-fit z-10 bg-white rounded">
              <ul className="flex flex-col text-black">
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
              </ul>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}

export default Dropdown;
