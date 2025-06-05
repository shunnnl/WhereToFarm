import React from 'react';

const FarmerDescription = ({ farmerType }) => {
  const { title, subtitle, description } = farmerType;
  
  return (
    <div className="bg-[#FFF9E2] rounded-lg p-6 mx-8 mt-8 shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-bold">"{subtitle}" </span>
        <p className="text-gray-700 font-medium">{title} 농부는...</p>
      </div>
      <p className="text-gray-700 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FarmerDescription;