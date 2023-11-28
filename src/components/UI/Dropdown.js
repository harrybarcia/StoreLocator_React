import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Checkbox from '@mui/material/Checkbox';
import { fetchFields } from '../fetchFields'


const Dropdown = (props) => {
  const [isOpen, setIsOpen] = React.useState([false, false]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [filteredData, setFilteredData] = useState(props.dataFromParent)
  const [permanentData, setPermanentData] = useState(props.permanentDataFromParent)
  const [isChecked, setIsChecked] = useState();
  const [isCheckedType, setIsCheckedType] = useState([]);
  const [uniqueData, setUniqueData] = useState([])
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedCities, setSelectedCities] = useState()
  const buttonsRef = useRef([]);
  const [fields, setFields] = useState([]);
  const [allFieldsTogether, setAllFieldsTogether] = useState([fields])
  const [nextOrder, setNextOrder] = useState(1); // Initial order


  // I keep tracks of the changes on filtered and permanent data
  useEffect(() => {
    setFilteredData(props.dataFromParent);
    setPermanentData(props.permanentDataFromParent)
  }, [props.permanentDataFromParent, props.dataFromParent]);
  // I trigger selectStoreWhenClick when isChecked is changed
  useEffect(() => {
    selectStoreWhenClick();
  }, [isCheckedType, selectedValues]);

  useEffect(() => {
  }, [isCheckedType]);

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

  useEffect(() => {
    setAllFieldsTogether([...fields]);
  }, [fields])
  
  console.log("fields", fields)
  console.log("allFieldsTogether", allFieldsTogether)
  // Use the fetchData() function in a useEffect hook.
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/allStores');
        const data = res.data;
        console.log(data)
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
        // Create the desired result as an array of arrays
        setUniqueData(uniqueData)

        const uniqueDataTest = data.reduce(
          (accumulator, store) => {
            const arrayOfFields = [store.city, store.address, store.price]; // Add other fields as needed
        
            // Ensure that accumulator has enough sub-arrays
            while (accumulator.length < arrayOfFields.length) {
              accumulator.push([]);
            }
        
            arrayOfFields.forEach((field, i) => {
              if (!accumulator[i].includes(field)) {
                accumulator[i].push(field);
              }
            });
        
            return accumulator;
          },
          []
        );

        const uniqueDataForEachType = store => {
          return store.typeObject.reduce(
            (accumulator, typeItem) => {
              const key = typeItem.key;
              console.log(key)
              const value = store[key];
              console.log(value)
        
              if (!accumulator[key].includes(value)) {
                accumulator[key].push(value);
              }
        
              return accumulator;
            },
            Object.fromEntries(store.typeObject.map(item => [item.key, []]))
          );
        };
                
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

  const selectStoreWhenClick = () => {
    // for each truthy value of my array, i filter the city
    const selectedCities = uniqueData[0]?.filter((city, index) => isCheckedType[0][index]);
    const selectedValues = uniqueData[1]?.filter((address, index) => isCheckedType[1][index])
    setSelectedCities(selectedCities)
    // setSelectedValues(selectedValues)
    const filteredConditions = permanentData?.map((item) => {
      const cityCondition = selectedCities?.includes(item.city);
      const addressCondition = selectedValues?.length > 0 ? selectedValues.includes(item.address) : permanentData.includes(item.address);
      return [cityCondition, addressCondition];
    });
    const filteredData = permanentData?.filter((_, index) => {
      const [cityCondition, addressCondition] = filteredConditions[index];
      return cityCondition && addressCondition;
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

  useEffect(() => {
    setFilteredData(filteredData?.filter((item) => selectedValues?.includes(item.address)))
  }, [selectedValues, isCheckedType])

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
  const oldtypes = [
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



  const types = allFieldsTogether?.map(obj => ({
    label: obj.key,
    data: obj.data,
    isCheckedType: false
  }));

  console.log(types)
  
  


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
