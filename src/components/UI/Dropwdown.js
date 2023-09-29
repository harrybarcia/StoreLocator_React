import React from 'react';
import { useState } from'react';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Dropdown = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isChecked, setIsChecked] = React.useState(true);
    const [results, setResults] = useState([]);
    const selectStore = (e) => {
        setIsChecked((prev) =>!prev);
        const myfilter = (city) => {
            const cityName = city;
            axios.get(`/search/${cityName}`)
                .then((res) => {
                    console.log("res", res);
                    setResults(res.data.data);
                });
    }
        myfilter(e.target.value);
    }
    console.log("results", results);
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
                <input type="checkbox" name="Vancouver" value="Vancouver" checked={isChecked} onChange={selectStore} />
                <label className="ml-2">Input 1</label>
              </li>
            </ul>
          </div>
        }
      </form>
    );
}

export default Dropdown;
