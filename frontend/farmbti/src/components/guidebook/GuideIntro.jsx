import React from 'react';

const GuideIntro = ({ description, imageSrc }) => {
  return (
    <div className="mb-16 px-4">
      <div className="p-12">
        <h3 className="text-2xl font-bold mb-4">가이드에서는</h3>
        <p className="text-primaryGreen text-lg leading-relaxed font-medium">
          귀농 준비시 나의 단계가 어떤 단계인지 판단해 보실 수 있으며,<br />
          각 단계에서 어떤 사항을 고려해야 하는지를 알아보실 수 있습니다.
        </p>
      </div>
      
      <div className="relative w-[1000px] mx-auto mt-[-100px]">
        <div className="relative left-12 top-[150px]">
          <div className="absolute flex flex-col gap-2 z-10">
            <span className="text-2xl font-bold">성공적인 귀농을 위한</span>
            <div className="bg-[#8D6E63] text-white px-6 py-2 rounded-full text-base w-fit font-bold">
              STEP 5
            </div>
          </div>
        </div>
        <img 
          src={imageSrc} 
          alt="가이드 소개" 
          className="w-full h-auto z-0"       />
        </div>
    </div>
  );
};

export default GuideIntro; 