import React, { useEffect } from 'react';
import { useState } from'react';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Dropdown = (props) => {
  const [isOpen, setIsOpen] = React.useState([true, false]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [filteredData, setFilteredData] = useState(props.dataFromParent)
  const [permanentData, setPermanentData] =useState(props.permanentDataFromParent)
  const [isChecked, setIsChecked] = useState(filteredData);
  const [isCategoryChecked, setIsCategoryChecked] = useState([false, false]);
  const uniqueCategories = ["cat1", "cat2"]
  const [selectedValues, setSelectedValues] = useState({});
     // I keep tracks of the changes on filtered and permanent data
  useEffect(() => {
    setFilteredData(props.permanentDataFromParent);
    setPermanentData(props.permanentDataFromParent)
  }, [props.permanentDataFromParent ]);
  
  // I trigger selectStoreWhenClick when isChecked is changed
  useEffect(() => {
    selectStoreWhenClick();
  }, [isChecked]);

  // I create my array of unique cities and set isChecked Array
  useEffect(() => {
    console.log('uniqueCities:', uniqueCities)
    axios.get(`/allStores`)
    .then((res) => {
      const uniqueArray = res.data.reduce((accumulator, store) => {
        if (!accumulator.includes(store.city)) {
          accumulator.push(store.city);
        }
        return accumulator;
      }, [])
      setUniqueCities(uniqueArray)
      setIsChecked(new Array(uniqueArray.length).fill(true));
    })
  }, [])
  const selectStoreWhenClick = () => {
    // for each truthy value of my array, i filter the city
    const selectedCities = uniqueCities?.filter((city, index) => isChecked[index]);
    // for each item that includes the city selected, I filter my filteredData 
    let filteredArray = filteredData?.filter((item) => selectedCities.includes(item.city));
    // i send it back to the parent component
    props.sendDataFromDropdown(filteredArray);
  };

    const handleCheckboxChange = (index) => {
      // Create a copy of the cityChecked array
      const updatedCityChecked = [...isChecked];
      // Toggle the checked state for the clicked city
      updatedCityChecked[index] = !updatedCityChecked[index];
      // Update the state of the value in the array
      setIsChecked(updatedCityChecked); // outputs [true, false, true, false]
    };
    console.log(selectedValues)

    const handleCheckboxChangeCategory = (value, index) => {
      console.log(value)
      // Create a copy of the cityChecked array
      const updatedCategoryChecked = [...isCategoryChecked];
      // Toggle the checked state for the clicked city
      updatedCategoryChecked[index] = !updatedCategoryChecked[index];
      // Update the state of the value in the array
      setIsCategoryChecked(updatedCategoryChecked); // outputs [true, false, true, false]

      // Create a copy of the selectedValues object
      const updatedSelectedValues = { ...selectedValues };

      // If the checkbox is checked, set the value in the selectedValues object
      if (updatedCategoryChecked[index]) {
        updatedSelectedValues[index] = value;
      } else {
        // If the checkbox is unchecked, remove the value from the selectedValues object
        delete updatedSelectedValues[index];
      }

      // Update the selectedValues state
      setSelectedValues(updatedSelectedValues);
    };
    console.log(selectedValues)

    console.log(isCategoryChecked)

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
                <li key={index} >
                  <input type="checkbox" id={index} name={city} checked={isChecked[index]}
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
                  <input type="checkbox" id={key} value={key} checked={isCategoryChecked[index]}
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
