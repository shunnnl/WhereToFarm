import React from 'react';

const ServiceIcons = ({ icons }) => {
  return (
    <div className="py-20">
      <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
        {/* 왼쪽: 아이콘 메뉴 */}
        <div className="grid grid-cols-4 gap-10 w-3/5">
          {icons.map((service, index) => (
            <a 
              key={index} 
              href={service.link} 
              className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
            >
              <div className="w-32 h-32 mb-6 flex items-center justify-center">
                <img 
                  src={service.icon} 
                  alt={service.title} 
                  className="w-24 h-24"
                />
              </div>
              <span className="text-center text-gray-700 font-medium text-2xl">{service.title}</span>
            </a>
          ))}
        </div>
        
        {/* 오른쪽: 주요 서비스 텍스트 */}
        <div className="w-2/5 flex flex-col justify-center pl-20">
          <h2 className="text-5xl font-bold mb-6">주요 서비스</h2>
          <p className="text-gray-600 text-2xl leading-relaxed">
            귀농플랫폼들의 주인공이 되기위한 첫 걸음,<br />
            어디가농과 함께 시작하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceIcons;