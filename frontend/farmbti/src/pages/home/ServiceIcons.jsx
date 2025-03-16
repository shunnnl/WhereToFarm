import React from 'react';

const ServiceIcons = ({ icons }) => {
  return (
    <div className="py-10">
      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {icons.map((service, index) => (
          <a 
            key={index} 
            href={service.link} 
            className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
          >
            <div className="w-16 h-16 mb-3 flex items-center justify-center">
              <img 
                src={service.icon} 
                alt={service.title} 
                className="w-12 h-12"
              />
            </div>
            <span className="text-center text-gray-700 font-medium">{service.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ServiceIcons;