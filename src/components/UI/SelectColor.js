import React from 'react';

const MultiSelectDropdownWithColorIndicator = () => {
  const options = [
    { name: 'Option 1', color: 'blue' },
    { name: 'Option 2', color: 'red' },
    // Add more options as needed
  ];

  const selectedItems = ['Option 1']; // Hard code your selected items here

  return (
    <div className="w-full">
      <ul className="mt-2 space-y-2 bg-white border rounded-md shadow-md">
        {options.map((option) => (
          <ColorIndicatorOption key={option.name} option={option} selectedItems={selectedItems}></ColorIndicatorOption>
        ))}
      </ul>
    </div>
  );
};

const ColorIndicatorOption = ({ option, selectedItems }) => {
  const isSelected = selectedItems.includes(option.name);

  return (
    <div
      key={option.name}
      className={`flex items-center p-2 ${isSelected ? 'bg-gray-300' : ''}`}
    >
      <div className="color-indicator" style={{ backgroundColor: option.color, width: '1em', height: '1em', borderRadius: '50%', marginRight: '0.5em' }}></div>
      <span className="mr-2">{option.name}</span>
    </div>
  );
};

export default MultiSelectDropdownWithColorIndicator;
