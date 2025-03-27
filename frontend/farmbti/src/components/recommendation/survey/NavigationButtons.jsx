import React from 'react';

const NavigationButtons = ({ 
  currentQuestion, 
  totalQuestions, 
  hasAnswer, 
  onPrev, 
  onNext 
}) => {
  return (
    <div className="flex justify-between mt-16">
      <button
        onClick={onPrev}
        disabled={currentQuestion === 0}
        className={`px-8 py-3 rounded-full font-bold
          ${currentQuestion === 0
            ? 'bg-gray-300 text-gray-500'
            : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
      >
        이전
      </button>
      <button
        onClick={onNext}
        disabled={!hasAnswer}
        className={`px-8 py-3 rounded-full font-bold
          ${!hasAnswer
            ? 'bg-gray-300 text-gray-500'
            : 'bg-[#1B4B36] text-white hover:bg-[#143728]'
          }`}
      >
        {currentQuestion === totalQuestions - 1 ? '완료' : '다음'}
      </button>
    </div>
  );
};

export default NavigationButtons;