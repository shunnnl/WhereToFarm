import React from 'react';

const GuideStep = ({ stepNumber, title, description, imageSrc }) => {
  return (
    <div className="border-b border-gray-200 py-8">
      <div className="flex items-start px-20 max-w-[1000px] mx-auto">
        <div className="w-[600px]">
          <div className="inline-block px-4 py-2 mb-4 text-white font-bold bg-supportGreen rounded-full">
            STEP {stepNumber}
          </div>
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
        <div className="w-[400px] flex justify-center items-center">
          <img 
            src={imageSrc} 
            alt={`Step ${stepNumber}`} 
            className="h-[200px] w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default GuideStep; 