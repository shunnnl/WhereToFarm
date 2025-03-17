import React from 'react';

const GradientSection = () => {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-white to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">그라데이션 섹션</h2>
        <a className="text-gray-700 text-lg">
          현장멘토 찾기
        </a>
      </div>
    </div>
  );
};

export default GradientSection;