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

    console.log('props.dataFromParent', props.dataFromParent);

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
    console.log('types', types);
    useEffect(() => {
    }, [filteredData]);
    console.log('filteredData', filteredData);

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

    const filterData = () => {
        const allFiltersSelected = [];
        permanentData?.forEach((item, index) => {
            const filterSelected = [];
            item.typeObject.forEach((typeObjectItem, typeObjectIndex) => {
                const isAnyIncluded = selectedItems[typeObjectIndex]?.includes(typeObjectItem.data[typeObjectIndex].name)
                filterSelected.push(isAnyIncluded);
            });
            allFiltersSelected.push(filterSelected);
        });
        console.log('filtersSelected', allFiltersSelected); 
        const filteredDataSorted = permanentData?.filter((item, index) => {
            const filterArray = allFiltersSelected[index].filter((condition) => condition != undefined);
            console.log('filterArray', filterArray);
            if (filterArray.every(value => value === true )) {
                return item
            }
        });
        console.log('filteredDataSorted', filteredDataSorted);
        // props.sendDataFromDropdown(filteredDataSorted)
    };
    
    return (
        <div>
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
