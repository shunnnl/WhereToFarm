import React from 'react';

const RegionButton = ({ regionName, index, onSelectCard }) => {
  return (
    <button 
      className="w-full bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all h-20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={() => onSelectCard(regionName)}
    >
      <h3 className="text-center font-medium text-xl text-gray-800">{regionName}</h3>
    </button>
  );
};

export default RegionButton;