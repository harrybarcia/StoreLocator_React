import React, { useEffect, useState } from 'react';

const GeoJsonEditor = ({ dataFromCsv, onClose }) => {
    console.log('dataFromCsv', dataFromCsv);
    const [editedGeoJSON, setEditedGeoJSON] = useState(dataFromCsv);
    console.log('editedGeoJSON', editedGeoJSON);
    useEffect(() => {
        setEditedGeoJSON(dataFromCsv)
    }, [dataFromCsv])

    const handlePropertyChange = (lineIndex, key, value) => {
        console.log('value', value);
        console.log('lineIndex', lineIndex);
        console.log('key', key);
        console.log('value', value);
    // Update the edited GeoJSON when a property is changed

    
    setEditedGeoJSON((prevGeoJSON) => {
        console.log('prevGeoJSON', prevGeoJSON);
        const updatedFeatures = [...prevGeoJSON];
        updatedFeatures[lineIndex][key] = value;
        return updatedFeatures; // Return the updated array directly
      });
    
    };
    console.log('dataFromCsv', dataFromCsv);
    console.log('editedGeoJSON', editedGeoJSON);

  return (
    <div>
      <button onClick={onClose}>Close</button>
      <div 
      className='flex flex-col overflow-scroll'
      >
        {dataFromCsv?.map((feature, index) => (
          <div key={index}
          className='flex flex-row'
          >
            <p
            className='mr-4'
            >Line {index + 1}</p>
            {/* Display properties and provide input fields for editing */}
            {Object.entries(feature).map(([key, value]) => (
              <div key={key}
              className='mr-4'
              >
                <label>{key}:</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handlePropertyChange(index, key, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeoJsonEditor;
