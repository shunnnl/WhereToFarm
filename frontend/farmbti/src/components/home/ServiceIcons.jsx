import React from 'react';

const ServiceIcons = ({ icons }) => {
  return (
    <div className="py-20">
      <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
        {/* 왼쪽: 아이콘 메뉴 */}
        <div className="w-3/5 flex justify-center">
          <div className="grid grid-cols-4 gap-10">
            {icons.map((service, index) => {
              const IconComponent = service.icon;
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center"
                >
                  {/* 아이콘과 텍스트를 포함하는 전체 컨테이너 */}
                  <a
                    href={service.link}
                    className="group flex flex-col items-center h-48 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300 w-full"
                  >
                    {/* 아이콘 컨테이너 - 상단 정렬 */}
                    <div className="h-32 flex items-center justify-center mb-4">
                      <IconComponent 
                        size={96}
                        className="text-black group-hover:text-green-500 transition-colors duration-300"
                        strokeWidth={1}
                      />
                    </div>
                    
                    {/* 텍스트 컨테이너 - 고정 높이 */}
                    <div className="h-10 flex items-center justify-center w-full">
                      <span className="text-center text-gray-700 font-medium text-lg">
                        {service.title}
                      </span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
                
        {/* 오른쪽: 주요 서비스 텍스트 */}
        <div className="w-2/5 flex flex-col justify-center pl-20">
          <h2 className="text-5xl font-bold mb-6">주요 서비스</h2>
          <p className="text-gray-600 text-2xl leading-relaxed">
            귀농인이 되기 위한 첫 걸음,<br />
            어디가농과 함께 시작하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceIcons;