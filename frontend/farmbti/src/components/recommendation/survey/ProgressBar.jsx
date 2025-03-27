import React from 'react';
// assets 폴더에서 이미지를 import 합니다
import progressIcon from '../../../asset/recommendation/survey/progress-icon.png';

const ProgressBar = ({ progress }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 mb-12">
      <div className="relative w-full h-2 bg-[#E8F3E7] rounded-full overflow-visible">
        <div 
          className="relative h-full bg-[#1B4B36] rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out"
          style={{ left: `${progress}%` }}
        >
          <img 
            src={progressIcon}
            alt="진행 상태"
            className="w-12 h-12 object-contain -translate-x-1/2"
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;