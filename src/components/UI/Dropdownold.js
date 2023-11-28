import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Checkbox from '@mui/material/Checkbox';

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

  console.log("isCheckedType", isCheckedType)

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

        const testObject = [{
          "location": {
              "type": "Point",
              "coordinates": [
                  -122.31191159972963,
                  49.7269237638487
              ],
              "formattedAddress": "455 waterfront roadf"
          },
          "_id": "655bed8232099aebff684e17",
          "storeId": "655bed8232099aebff684e16",
          "address": "455 waterfront roadf",
          "image": "6192.jpg",
          "userId": "64fa71d29df5a1f4b8cf582f",
          "city": "north",
          "price": 5,
          "rating": 5,
          "skipGeocoding": true,
          "fields": [
              "655bed0132099aebff684dbf"
          ],
          "typeObject": [
              {
                  "id": "655bed0132099aebff684dbf",
                  "key": "Zonage",
                  "value": "String",
                  "visibility": true,
                  "isFilter": false,
                  "order": 0
              },
              {
                  "id": "655c4bac332baa10cfc2d67e",
                  "key": "Field 3",
                  "value": "String",
                  "isFilter": false,
                  "visibility": true,
                  "order": 1,
                  "data": ""
              },
              {
                  "id": "655c4dc8332baa10cfc2d759",
                  "key": "dlfkjzldkfj",
                  "value": "String",
                  "isFilter": false,
                  "visibility": true,
                  "order": 2,
                  "data": ""
              },
              {
                  "id": "655c4dc8332baa10cfc2d760",
                  "key": "fggb;,n",
                  "value": "Number",
                  "isFilter": false,
                  "visibility": true,
                  "order": 3,
                  "data": ""
              }
          ],
          "createdAt": "2023-11-20T23:36:34.015Z",
          "reviews": [],
          "__v": 10
      }];

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
        
        const uniqueDataT = testObject.map(store => uniqueDataForEachType(store));
        
        console.log(uniqueDataT);

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

  console.log("uniqueData",uniqueData)
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