import React from 'react';

const SurveyQuestion = ({ questionNumber, question, selectedValue, onValueChange }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 질문 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Q{questionNumber}. {question}</h2>
      </div>

      {/* 응답 옵션 */}
      <div className="flex justify-between items-center gap-4">
        <span className="text-gray-500">낮음</span>
        <div className="flex-1 flex justify-between gap-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => onValueChange(value)}
              className={`w-16 h-16 rounded-full text-xl font-bold transition-colors
                ${selectedValue === value 
                  ? 'bg-[#1B4B36] text-white' 
                  : 'bg-[#E8F3E7] text-[#1B4B36] hover:bg-[#C5E0C4]'
                }`}
            >
              {value}
            </button>
          ))}
        </div>
        <span className="text-gray-500">높음</span>
      </div>
    </div>
  );
};

export default SurveyQuestion;