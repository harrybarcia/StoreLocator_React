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
  const [isChecked, setIsChecked] = useState(filteredData);
  const [isCategoryChecked, setIsCategoryChecked] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([])
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedCities, setSelectedCities] = useState()
     // I keep tracks of the changes on filtered and permanent data
  useEffect(() => {
    console.log("props", props.dataFromParent)
    setFilteredData(props.dataFromParent);
    setPermanentData(props.permanentDataFromParent)
  }, [props.permanentDataFromParent, props.dataFromParent ]);
  console.log(filteredData)
  // I trigger selectStoreWhenClick when isChecked is changed
  useEffect(() => {
    selectStoreWhenClick();
  }, [isChecked, selectedValues]);

  useEffect(() => {
    console.log("here")
  }, [isCategoryChecked]);
  

  // I create my array of unique cities and set isChecked Array
  // Create an async function to fetch the data from the `/allStores` endpoint.

// Use the fetchData() function in a useEffect hook.
useEffect(() => {
  async function fetchData() {
    try {
      const res = await axios.get('/allStores');
      const data = res.data;
      console.log(data); // Log the data within the function

      // Continue working with the data inside this function
      const uniqueCities = data.reduce((accumulator, store) => {
        if (!accumulator.includes(store.city)) {
          accumulator.push(store.city);
        }
        return accumulator;
      }, []);

      const uniqueCategories = data.reduce((accumulator, store) => {
        if (!accumulator.includes(store.address)) {
          accumulator.push(store.address);
        }
        return accumulator;
      }, []);

      setUniqueCities(uniqueCities);
      setUniqueCategories(uniqueCategories);
      setIsChecked(new Array(uniqueCities.length).fill(true));
      setIsCategoryChecked(new Array(uniqueCategories.length).fill(true));
    } catch (error) {
      // Handle errors
      console.error('Error fetching data:', error);
    }
  }

  fetchData(); // Call the function
}, []);


// Log the uniqueCities and uniqueCategories state variables to the console.
console.log('uniqueCities:', uniqueCities);
console.log('uniqueCategories:', uniqueCategories);
console.log("isChecked", isChecked)
console.log(selectedValues)

  console.log("uniqueCategories", uniqueCategories)
  const selectStoreWhenClick = () => {
    // for each truthy value of my array, i filter the city
    const selectedCities = uniqueCities?.filter((city, index) => isChecked[index]);
    const selectedValues = uniqueCategories?.filter((address, index) => isCategoryChecked[index])
    console.log(selectedCities)
    console.log(selectedValues)
    setSelectedCities(selectedCities)

      const filteredConditions = permanentData?.map((item) => {

        const cityCondition = selectedCities.includes(item.city);
        const addressCondition = selectedValues.length>0?selectedValues.includes(item.address):permanentData.includes(item.address);
        return [cityCondition, addressCondition];
      });
      console.log(filteredConditions) // outputs [true, false] *6
      
      const filteredData = permanentData?.filter((_, index) => {
        const [cityCondition, addressCondition] = filteredConditions[index];
        return cityCondition && addressCondition;
      });
      console.log(filteredData)
      
    props.sendDataFromDropdown(filteredData);
  };

    const handleCheckboxChange = (index) => {
      // Create a copy of the cityChecked array
      const updatedCityChecked = [...isChecked];
      // Toggle the checked state for the clicked city
      updatedCityChecked[index] = !updatedCityChecked[index];
      // Update the state of the value in the array
      setIsChecked(updatedCityChecked); // outputs [true, false, true, false]

    };

    console.log(isCategoryChecked)

    const handleCheckboxChangeCategory = (value, index) => {
      console.log(value)
      console.log(isCategoryChecked)
      // Create a copy of the cityChecked array
      const updatedCategoryChecked = [...isCategoryChecked];
      // Toggle the checked state for the clicked city
      updatedCategoryChecked[index] = !updatedCategoryChecked[index];
      // Update the state of the value in the array
      setIsCategoryChecked(updatedCategoryChecked); // outputs [true, false, true, false]
      
      const updatedSelectedValues = { ...selectedValues }
      if (updatedCategoryChecked[index]) {
        updatedSelectedValues[index] = value;
      } else {
        // If the checkbox is unchecked, remove the value from the selectedValues object
        updatedSelectedValues[index]=null;
      }
      console.log(updatedSelectedValues)
      const selectedValuesArray = Object.values(updatedSelectedValues);  
      console.log(selectedValuesArray)
      setSelectedValues(selectedValuesArray)
      
    }
    console.log(isCategoryChecked)
    console.log(selectedValues)
    

    useEffect(() => {

    }, [isCategoryChecked])
    
    useEffect(() => {
      console.log("here for selectedvalues", selectedValues)
      setFilteredData(filteredData?.filter((item)=>selectedValues?.includes(item.address)))
    }, [selectedValues, isCategoryChecked])
    console.log("isCategoryChecked",isCategoryChecked)
    // console.log("results",results)
    console.log("selectedValues",selectedValues)
    console.log("filteredData",filteredData)
    console.log("permanentData",permanentData)
    console.log("isCategoryChecked",isCategoryChecked)
    console.log("uniqueC",uniqueCategories)




    return (
      <>
        <form className=" relative flex justify-center m-2">
        <button 
        type="button"
        className=" w-fit rounded-full p-2 text-black font-bold text-lg hover:gray border border-black" 
        onClick={() => setIsOpen([!isOpen[0], isOpen[1]])}>Types
        {isOpen[0]? <ArrowDropDownIcon className="h-8" /> : <ArrowDropUpIcon className="h-8" />}
        </button>
        {
          isOpen[0] && <div className="absolute text-black font-bold flex flex-col top-12  p-2 w-fit z-10 bg-white rounded">
            <ul className="flex flex-col text-black" >
              {
                uniqueCities.map((city, index) => (
                  
                <li  >
                  <Checkbox id={index} name={city} checked={isChecked[index]}
                  onChange={() => handleCheckboxChange(index)}
                  />
                  <label className="ml-2" htmlFor={index}>{city}</label>
                </li>
                
                  ))
              }
            </ul>
          </div>
        }
      </form>
      <form className=" relative flex justify-center m-2">
        <button 
        type="button"
        className=" w-fit rounded-full p-2 text-black font-bold text-lg hover:gray border border-black" 
        onClick={() => setIsOpen([isOpen[0], !isOpen[1]])}>Types
        {isOpen[1]? <ArrowDropDownIcon className="h-8" /> : <ArrowDropUpIcon className="h-8" />}
        </button>
        {
          isOpen[1] && <div className="absolute text-black font-bold flex flex-col top-12  p-2 w-fit z-10 bg-white rounded">
            <ul className="flex flex-col text-black" >
              {
                uniqueCategories.map((key, index) => (
                <li key={index} >
                  <Checkbox id={key} value={key} checked={isCategoryChecked[index]}
                  onChange={(e) => handleCheckboxChangeCategory(e.target.value, index )}
                  />
                  <label className="ml-2" htmlFor={key}>{key}</label>
                </li>
                  ))
              }
            </ul>
          </div>
        }
      </form>
      </>
    );
}

export default Dropdown;
