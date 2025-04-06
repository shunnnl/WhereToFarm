import React from 'react';

const RegionButton = ({ regionName, index, onSelectCard, isSelected }) => {
  return (
    <button
      className={`w-full rounded-lg shadow-md p-4 transition-all h-20 flex items-center justify-center focus:outline-none
        ${isSelected 
          ? 'bg-green-800 text-white hover:bg-green-600' 
          : 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-lg'
        }`}
      onClick={() => onSelectCard(regionName)}
    >
      <h3 className={`text-center font-medium text-xl ${isSelected ? 'text-white' : 'text-gray-800'}`}>
        {regionName}
      </h3>
    </button>
  );
};

export default RegionButton;