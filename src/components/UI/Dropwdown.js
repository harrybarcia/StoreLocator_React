import React, { useEffect } from 'react';
import { useState } from'react';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Dropdown = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [results, setResults] = useState([]);
  const [filteredData, setFilteredData] = useState(props.dataFromParent)
  useEffect(() => {
    setFilteredData(props.dataFromParent);
  }, [props.dataFromParent]);

  useEffect(() => {
    selectStore();
  }, [isChecked]);

  const selectStore = () => {
    const cachedData = localStorage.getItem('cachedData');
    if (isChecked) {
      // This code block will execute when isChecked is true
      // Fetch data based on the selected value
      // Filter objects with "North" in the city field

      const filteredArray = filteredData.filter((item) =>
        item.city.toLowerCase().includes("north")
      );
      console.log('filtered Array', filteredArray);
      props.sendDataFromDropdown(filteredArray);
      props.sendCheckFromDropdown(isChecked)

    } else {
      props.sendCheckFromDropdown(isChecked)

    }
  }
    return (
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
              <li>
                <input type="checkbox" checked={isChecked} onChange={() =>{
                  setIsChecked((prev) => !prev)
                }}  />
                <label className="ml-2">Input 1</label>
              </li>
            </ul>
          </div>
        }
      </form>
    );
}

export default Dropdown;
