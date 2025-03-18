import React from 'react';

const RegionCard = ({ regionName, index }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow h-15">
      <h3 className="text-center font-medium text-lg text-gray-800">{regionName}</h3>
    </div>
  );
};

export default RegionCard;