import React, { useEffect } from 'react';
import { useState } from'react';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Dropdown = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [uniqueCities, setUniqueCities] = useState([]);

  // at first, filteredData is set with permanent data from the map.js component, that comes from get call
  const [filteredData, setFilteredData] = useState(props.dataFromParent)
  const [permanentData, setPermanentData] =useState(props.permanentDataFromParent)
  useEffect(() => {
    setFilteredData(props.dataFromParent);
    setPermanentData(props.permanentDataFromParent)
    setUniqueCities(
      permanentData?.reduce((accumulator, store) => {
        if (!accumulator.includes(store.city)) {
          accumulator.push(store.city);
        }
        return accumulator;
      }, [])
    );
  }, [props.dataFromParent,props.permanentDataFromParent ]);

// I loop trough my data to reduce the cities and store it in a variable, every time my permanent data changes it changes the 
// panel of cities IF the value of the checkbox is true


  // I initiate a new array with the true value for all the length of uniqueCities
  const [isChecked, setIsChecked] = useState(filteredData);
  console.log('isChecked:', isChecked)

  // I trigger selectStore when isChecked is changed
  useEffect(() => {
    selectStore();
  }, [isChecked]);


  console.log('uniqueCities:', uniqueCities)
  // 
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
      setIsChecked(new Array(uniqueArray.length).fill(true));
    })
    console.log(isChecked)
  }, [])
  console.log(isChecked)

  const selectStore = () => {
    // i have my array of 4 cities in unique cities. I also have my array of 4 values ischecked, if true, filtered.
    const selectedCities = uniqueCities?.filter((city, index) => isChecked[index]);
    console.log(selectedCities) // outputs "north"
    console.log(permanentData)
    let filteredArray = permanentData?.filter((item) => selectedCities.includes(item.city));
    console.log("filtered", filteredArray) // outputs an array of 3 stores that have north as city
    // i send it back to the parent component
    props.sendDataFromDropdown(filteredArray);
    // props.sendCheckFromDropdown(isChecked);
  };

    const handleCheckboxChange = (index) => {
      // Create a copy of the cityChecked array
      const updatedCityChecked = [...isChecked];
      console.log(updatedCityChecked)
      // Toggle the checked state for the clicked city
      updatedCityChecked[index] = !updatedCityChecked[index];
      // Update the state of the value in the array
      setIsChecked(updatedCityChecked); // outputs [true, false, true, false]
    };

    const items = ['Item 1', 'Item 2', 'Item 3'];
    

    return (
      <>
      {items.map((item) => (
        <form className=" relative flex justify-center m-2">
        <button 
        type="button"
        className=" w-fit rounded-full p-2 text-black font-bold text-lg hover:gray border border-black" 
        onClick ={()=>setIsOpen((prev) => !prev)} >Types
        {isOpen? <ArrowDropDownIcon className="h-8" /> : <ArrowDropUpIcon className="h-8" />}
        </button>
        {
          isOpen && <div className="absolute text-black font-bold flex flex-col top-12  p-2 w-fit z-10 bg-white rounded">
            <ul className="flex flex-col text-black" >
              {
                uniqueCities.map((city, index) => (
                <li key={index} >
                  <input type="checkbox" id={index} checked={isChecked[index]}
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
      ))}
      </>
    );
}

export default Dropdown;
