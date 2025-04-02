import React from 'react';
import progressIcon from '../../../asset/recommendation/survey/progress-icon.png';

const ProgressBar = ({ progress }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 mb-12">
      <div className="relative w-full h-2 bg-[#E8F3E7] rounded-full">
        <div 
          className="absolute left-0 h-full bg-[#1B4B36] rounded-full transition-[width] duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
        
        <div
          className="absolute h-12 w-12 transition-[left] duration-300 ease-in-out"
          style={{ 
            left: `${Math.min(progress, 100)}%`,
            top: '50%',
            marginLeft: '-24px',
            marginTop: '-24px'
          }}
        >
          <img 
            src={progressIcon}
            alt="진행 상태"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 