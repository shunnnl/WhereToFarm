import React from 'react';
import farmer_image from '../../asset/mentor/farmer.png'
const GradientSection = () => {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-white to-amber-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6 max-w-6xl mx-auto px-4">
        <img
          src={farmer_image}
          alt="농부이미지"
          className="w-56"
        />
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">현장멘토 찾기</h2>
          <a className="text-gray-700 text-lg">
            지역별 귀농 전문가를 찾아볼 수 있어요.<br/> 
            귀농에 대한 장벽을 낮추고, 풍요로운 귀농 생활을 지원해드릴게요.
          </a>
        </div>
      </div>
    </div>
  );

};

export default GradientSection;