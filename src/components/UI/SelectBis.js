import React, { useState, useEffect } from 'react';
import { fetchFields } from '../fetchFields'


const SelectBis = (props) => {
    const [selectedItems, setSelectedItems] = useState([]);
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

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;

        // Check if the value is already in the selected items array
        const isSelected = selectedItems.includes(selectedValue);

        // Update the selected items based on the click
        if (isSelected) {
            // If the item is already selected, remove it
            setSelectedItems(selectedItems.filter(item => item !== selectedValue));
        } else {
            // If the item is not selected, add it
            setSelectedItems([...selectedItems, selectedValue]);
        }
    };
    useEffect(() => {
        filterItems()
    }, [selectedItems])

    const filterItems = () => {
        const filteredStores = permanentData?.map((store) => {
            const filteredTypes = store.typeObject?.filter((typeObject) => {
                return typeObject.data?.some((item) => selectedItems.includes(item?.name));
            });

            // Return the store with filtered types
            return { ...store, typeObject: filteredTypes };
        });

        // Filter out stores with no matching types
        const finalFilteredStores = filteredStores?.filter((store) => store.typeObject?.length > 0);
        console.log('finalFilteredStores', finalFilteredStores);

        // Update the filteredData state with the filtered result
        props.sendDataFromDropdown(finalFilteredStores);

    }
    console.log('selectedItems', selectedItems);








    return (
        <div>
            {/* <select
        id="selectItem"
        name="selectItem"
        className="overflow-hidden "
        multiple
        value={selectedItems}
        onChange={(e) => setSelectedItems(Array.from(e.target.selectedOptions, (option) => option.value))}
        >
        <option value="Solar">Solar</option>
        <option value="Storage">Storage</option>
        <option value="Wind">Wind</option>
      </select> */}
            {types.map((type, typeIndex) => (
                <div className='w-auto flex-col overflow-hidden justify-between p-2 '>

                    <h2
                        className='font-bold'
                    >{type.label}
                    </h2>
                    <select
                        multiple
                        id={type.name}
                        name={type.name}
                        className="overflow-hidden"
                        value={selectedItems}
                        onChange={(e) => setSelectedItems(Array.from(e.target.selectedOptions, (option) => option.value))}

                    >
                        {type?.data?.map((item, itemIndex) => (
                            <option key={item.name} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

        </div>
    );
};

export default SelectBis;
