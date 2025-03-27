import React from 'react';
import FarmerImage from '../../asset/home/calculator.svg';

const Mentor = () => {
    return (
          <div 
          className="bg-green-600 rounded-xl overflow-hidden shadow-md transition-transform hover:-translate-y-1 duration-300 relative min-h-[245px]"
          style={{
            background: 'linear-gradient(155.1deg, #5e63a7 -30.35%, #25412c 241.15%)'
          }}
          >
            {/* Content Container */}
            <div className="flex items-center p-8">
              {/* Text Section */}
              <div className="text-white flex-grow pr-6 self-start pt-4">
                <h2 className="text-4xl font-bold mb-4">
                  내 작물로 얻는 수익은 얼마일까?
                </h2>
                <h3 className="text-white text-2xl py-2 font-semibold">
                  '작물 계산기'로 바로가기기 ↗️
                </h3>
              </div>
              
              {/* Farmer Illustration */}
              <div className="w-96 h-48">
              <img 
                  src={FarmerImage} 
                  alt="계산기" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
      );
    
  };
  
  export default Mentor;