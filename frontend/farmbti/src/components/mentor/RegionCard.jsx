import React from 'react';

const RegionCard = ({ regionName, index, onSelectCard   }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow h-20 flex items-center justify-center"
    onClick={() => onSelectCard(regionName)}

    >
      <h3 className="text-center font-medium text-xl text-gray-800">{regionName}</h3>
    </div>
  );
};

export default RegionCard;