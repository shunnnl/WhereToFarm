import React from 'react';
import FarmerImage from '../../asset/home/farmer.svg';

const Mentor = () => {
    return (
          <div 
          className="bg-green-600 rounded-xl overflow-hidden shadow-md transition-transform hover:-translate-y-1 duration-300 relative min-h-[245px]"
          style={{
            background: 'linear-gradient(155.1deg, #5ea770 -30.35%, #25412c 241.15%)'
          }}
          >
            {/* Content Container */}
            <div className="flex items-center p-8">
              {/* Text Section */}
              <div className="text-white flex-grow pr-6 self-start pt-4">
                <h2 className="text-4xl font-bold mb-4">
                  귀농인의 삶이 궁금하다면?
                </h2>
                <h className="text-white text-2xl py-2 font-semibold">
                  '멘토 찾기'로 바로가기 ↗️
                </h>
              </div>
              
              {/* Farmer Illustration */}
              <div className="w-96 h-48">
              <img 
                  src={FarmerImage} 
                  alt="농부 일러스트레이션" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
      );
    
  };
  
  export default Mentor;