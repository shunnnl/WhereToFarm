import React, { useState, useEffect } from 'react';

const BannerSlider = ({ slides }) => {
  // 현재 표시될 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 자동 슬라이딩 효과 
  useEffect(() => {
    const interval = setInterval(() => {
      // 다음 이미지로 이동 (마지막 이미지면 처음으로 돌아감)
      setCurrentImageIndex((prevIndex) => 
         prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5초마다 이미지 변경
    
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
  }, [slides.length]);

  // 수동으로 이미지 변경하는 함수
  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
          />

          {/* 텍스트가 있는 경우만 표시 */}
          {slide.text && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20">
              <p className="text-8xl text-white font-bold shadow-lg">
                {slide.text.before}
                <span className="text-green-800">{slide.text.highlight}</span>
                {slide.text.after}
              </p>
            </div>
          )}
                    
          {/* 버튼이 있는 경우에만 표시 */}
          {slide.button && (
            <a
              href={slide.button.link}
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-16 py-6 text-2xl bg-green-800 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors duration-300"
            >
              {slide.button.text}
            </a>
          )}
          </div>
      ))}
      
      {/* 하단 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentImageIndex ? 'bg-white' : 'bg-gray-400 bg-opacity-50'
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;