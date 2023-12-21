import React, { useState, useEffect } from 'react';
import { fetchFields } from '../fetchFields'


const MultiSelectableDropdown = (props) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [fields, setFields] = useState([]);
    const [filteredData, setFilteredData] = useState(props.dataFromParent)
    const [permanentData, setPermanentData] = useState(props.permanentDataFromParent)
    const [isCheckedType, setIsCheckedType] = useState([]);

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
    }, [isCheckedType, filteredData]);
    console.log('filteredData', filteredData);
    
  // Fetch data when the component mounts
  const fetchData = async () => {
    const dataRaw = await fetchFields();
    const data = dataRaw.filter((item)=>item.isFilter)
    const maxOrder = Math.max(...data.map((field) => field.order), 0);
    setNextOrder(maxOrder + 1);
    setFields(data); // Update the state with the fetched data
  };
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to run the effect once when the component mounts  

    useEffect(() => {
        async function fetchData() {
            try {
                // Dynamic function to fill each inner array with 'true' values
                function fillArraysWithTrue(fields) {
                    return fields.map(obj => {
                        return Array.from({ length: obj.colors.length }, () => true);
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
        props.sendFieldsDataFromDropdown(fields)
    }, [fields]);
    const types = fields?.map((obj, index) => ({
        label: obj.key,
        data: obj.colors,
        isCheckedType: isCheckedType[index],
        order:obj.order,
        isFilter:obj.isFilter
      }));
    console.log('types', types);

    const filteredAndSortedTypes = types.slice().sort((a, b) => a.order - b.order);
    filteredAndSortedTypes.slice().sort((a, b) => a.order - b.order);
    const selectStoreWhenClick = (filteredAndSortedTypes, isCheckedType) => {
        let selectedValuesArrays = [];
        filteredAndSortedTypes?.forEach((item, index) => {
            if (isCheckedType.length > 0) {
                const selectedValuesForEachItem = item?.data?.filter((_item, dataIndex) => isCheckedType[index][dataIndex]);
                const label = item.label;
                // Accumulate changes in the temporary variable
                selectedValuesArrays.push({ label: label, values: selectedValuesForEachItem });
            }
        });
        const filteredArray = selectedValuesArrays?.sort((a, b) => b.order - a.order);
        const myConditionArrays = []
        permanentData?.map((item) => {
            const myConditionArray = item?.typeObject
                ?.filter((tItem) => tItem.isFilter === true)
                ?.map((tItem) => {
                    const isFieldDataIncluded =
                        tItem.data?.some((dataItem) =>
                            filteredArray?.[tItem.order]?.values?.some(
                                (valueItem) => valueItem?.name === dataItem?.name
                            )
                        );
                    return isFieldDataIncluded;
                })
                .filter((condition) => condition !== undefined);

            if (myConditionArray.length > 0) {
                myConditionArrays.push(myConditionArray);
            }
        });
        const filteredDataSorted = permanentData?.filter((_, index) =>
            myConditionArrays[index].every(condition => condition)
        );
        console.log('filteredData', filteredData);
        props.sendDataFromDropdown(filteredDataSorted);
    };

    const handleCheckboxChange = (typeIndex, itemIndex, item) => {

        // Create a copy of the isCheckedType array
        const updatedCheckedType = [...isCheckedType];
        // Toggle the checked state for the clicked city
        updatedCheckedType[typeIndex][itemIndex] = !updatedCheckedType[typeIndex][itemIndex];
        // Update the state with the new value
        setIsCheckedType(updatedCheckedType);
    };
    useEffect(() => {
    }, [isCheckedType])

    useEffect(() => {
    }, [filteredData])

    const handleItemClick = (item) => {
        const updatedSelection = selectedItems.includes(item)
            ? selectedItems.filter((selectedItem) => selectedItem !== item)
            : [...selectedItems, item];

        setSelectedItems(updatedSelection);
    };
    console.log('selectedItems', selectedItems);


    return (
        <div className=' max-h-screen overflow-hidden '>
            {types.map((type, typeIndex) => (
                <div className='w-auto flex-col overflow-hidden justify-between p-2 '>

                    <h2
                        className='font-bold'
                    >{type.label}
                    </h2>
                    <select
                        id={type.name}
                        name={type.name}
                        className='overflow-hidden '
                        multiple
                        value={selectedItems}

                    >
                        {type?.data?.map((item, itemIndex) => (
                            <option key={item.name} value={item.name}
                            onClick={() => handleCheckboxChange(typeIndex, itemIndex, item)}
                            >
                                {item.name}
                            </option>
                            
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export default MultiSelectableDropdown;
