import React, { useState, useEffect } from 'react';
import { fetchFields } from '../fetchFields'


const SelectBis = (props) => {
    const [selectedItems, setSelectedItems] = useState([{}]);

    const [filteredData, setFilteredData] = useState(props.dataFromParent)
    const [permanentData, setPermanentData] = useState(props.permanentDataFromParent)
    const [fields, setFields] = useState([]);

    useEffect(() => {
        setFilteredData(props.dataFromParent);
        setPermanentData(props.permanentDataFromParent)
    }, [props.permanentDataFromParent, props.dataFromParent]);

    console.log('permanentData', permanentData);
    console.log('filteredData', filteredData);

    const fetchData = async () => {
        const dataRaw = await fetchFields();
        const data = dataRaw.filter((item) => item.isFilter)
        setFields(data); // Update the state with the fetched data
    };
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to run the effect once when the component mounts 

    useEffect(() => {

        props.sendFieldsDataFromDropdown(fields)
    }, [fields]);

    const types = fields?.map((obj, index) => ({
        label: obj.key,
        data: obj.colors
    }));
    useEffect(() => {
    }, [filteredData]);
    // console.log('filteredData', filteredData);

    useEffect(() => {
        filterData();
    }, [selectedItems])



    const handleSelectChange = (typeIndex, selectedOptions) => {
        // I retrieve the existing array 
        setSelectedItems((prevSelectedItems) => ({
            // I copy the array and add the selected option
          ...prevSelectedItems,
          [typeIndex]: selectedOptions,
        }));
      };
    console.log('selectedItems', selectedItems);

    const resetFilters = () => {
        props.sendDataFromDropdown(permanentData)
        setSelectedItems([])
    }

    const filterData = async () => {
        const data =await Promise.all(permanentData?.map(async (item, index) => {
            const selectionData = item.typeObject.map((typeObjectItem, tIndex) => {
                const result = isSelectionIncludedInStore(typeObjectItem,tIndex, selectedItems);
                return result
            })
            return selectionData
        }));
        
        console.log('data', data);
        const filteredData = []
        for (let i = 0; i < data.length; i++) {
            const allValuesAreTrue = data[i].every(item => item === true || (Array.isArray(item) && item.length === 0));
            console.log(`allValuesAreTrue for data[${i}]`, allValuesAreTrue);
            allValuesAreTrue && filteredData.push(permanentData[i])
        }
        props.sendDataFromDropdown(filteredData)
    }

    // console.log('filteredData', filteredData);

    const isSelectionIncludedInStore = (uniqueTypeObject,tIndex, selection) => {
        console.log('uniqueTypeObject', uniqueTypeObject);
        // const selection = [{"0":"Solar"},{"1":"Canada"},{"2":"Gris"} ]
        // const uniqueTypeObject = 
        // [
        //     {
        //         "id": "657e485d84fd09907702d3b7",
        //         "key": "Technologies",
        //         "value": "String",
        //         "visibility": true,
        //         "isFilter": true,
        //         "order": 0,
        //         "colors": [
        //             {
        //                 "name": "Solar",
        //                 "color": "#c5df07",
        //                 "_id": "657e485c84fd09907702d3b1",
        //                 "__v": 0
        //             },
        //             {
        //                 "name": "Storage",
        //                 "color": "#1eca1c",
        //                 "_id": "657e485c84fd09907702d3b3",
        //                 "__v": 0
        //             },
        //             {
        //                 "name": "Wind",
        //                 "color": "#1c56ca",
        //                 "_id": "657e485c84fd09907702d3b5",
        //                 "__v": 0
        //             }
        //         ],
        //         "data": [
        //             {
        //                 "name": "Solar",
        //                 "color": "#c5df07",
        //                 "_id": "657e485c84fd09907702d3b1",
        //                 "__v": 0
        //             }
        //         ]
        //     },
        //     {
        //         "id": "6583a86bf3af279751aea0f0",
        //         "key": "Countries",
        //         "value": "",
        //         "visibility": true,
        //         "isFilter": true,
        //         "order": 1,
        //         "colors": [
        //             {
        //                 "name": "Canada",
        //                 "color": "#e61919",
        //                 "_id": "6583a86bf3af279751aea0ec",
        //                 "__v": 0
        //             },
        //             {
        //                 "name": "US",
        //                 "color": "#3119e6",
        //                 "_id": "6583a86bf3af279751aea0ee",
        //                 "__v": 0
        //             }
        //         ],
        //         "data": [
        //             {
        //                 "name": "Canada",
        //                 "color": "#e61919",
        //                 "_id": "6583a86bf3af279751aea0ec",
        //                 "__v": 0
        //             }
        //         ]
        //     },
        //     {
        //         "id": "65861cfaf3af279751aea53a",
        //         "key": "Scale",
        //         "value": "String",
        //         "visibility": true,
        //         "isFilter": true,
        //         "order": 2,
        //         "colors": [
        //             {
        //                 "name": "gris",
        //                 "color": "#000000",
        //                 "_id": "65861cf9f3af279751aea535",
        //                 "__v": 0
        //             },
        //             {
        //                 "name": "no grid",
        //                 "color": "#000000",
        //                 "_id": "65861cfaf3af279751aea537",
        //                 "__v": 0
        //             }
        //         ],
        //         "data": [
        //             {
        //                 "name": "gris",
        //                 "color": "#000000",
        //                 "_id": "65861cf9f3af279751aea535",
        //                 "__v": 0
        //             }
        //         ]
        //     }
        // ];
        console.log('selection', selection);
        const resultArray = [];
        for (const selectKey in selection) {
            if (parseInt(selectKey) === tIndex) {
              if (selection[selectKey].length>0) {
                return selection[selectKey].includes(uniqueTypeObject.data[0]['name']);
              } else {
                return []; // Return an empty array if selection[selectKey] is undefined or null
              }
            }
          }
          console.log('resultArray', resultArray);
          return resultArray;
    }    
    return (
        <div >
            {types.map((type, typeIndex) => (
                <div className='w-auto flex-row overflow-hidden justify-between p-2 '>

                    <h2
                        className='font-bold'
                    >{type.label}
                    </h2>
                    <select
                        multiple
                        id={type.name}
                        name={type.name}
                        className="overflow-hidden"
                        value={selectedItems[typeIndex] || []}
                        onChange={(e) => handleSelectChange(typeIndex, Array.from(e.target.selectedOptions, (option) => option.value))}
                    >
                        {type?.data?.map((item, itemIndex) => (
                            <option key={item.name} value={item.name}
                            // onClick={() => handleOptionClick(typeIndex, item.name)}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <h2>
                    {type.data.name}
                    </h2>

                </div>
            ))}
            <div>
                <button
                onClick={resetFilters}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default SelectBis;