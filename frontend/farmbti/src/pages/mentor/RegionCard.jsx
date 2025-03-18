import React from 'react';

const RegionCard = ({ regionName, index }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <h3 className="font-medium text-lg text-gray-800">{regionName}</h3>
      <p className="text-sm text-gray-500 mt-2">Region ID: {index + 1}</p>
    </div>
  );
};

export default RegionCard;