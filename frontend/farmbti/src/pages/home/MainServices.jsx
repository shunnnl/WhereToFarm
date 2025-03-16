import React from 'react';

const MainServices = ({ services }) => {
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-center mb-8">주요 서비스</h2>
      <div className="max-w-4xl mx-auto">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="mb-8 p-6 bg-white rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
            <div className="mt-4">
              <a 
                href="#" 
                className="text-green-600 font-medium hover:text-green-700 transition-colors duration-300"
              >
                자세히 보기 &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainServices;