import React, { useState } from 'react';
import PolicyModal from './PolicyModal';

const PolicyCard = ({ policy }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{policy.title}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span className="mr-4">{policy.region}</span>
            <span>{policy.registrationDate}</span>
          </div>
          <p className="text-gray-700 line-clamp-2">
            {policy.description}
          </p>
        </div>
      </div>

      <PolicyModal 
        policy={policy}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PolicyCard;