import React, { useState, useEffect } from 'react';
import homeimage_1 from "../asset/home/home_image_1.svg";
import homeimage_2 from "../asset/home/home_image_2.svg"; 
import homeimage_3 from "../asset/home/home_image_3.svg"; 
import FullWidthSection from '../../../components/layout/FullWidthSection';
import PageLayout from '../../../components/layout/PageLayout';

const Home = () => {
  // 슬라이더에 사용할 이미지 배열과 각 이미지별 버튼 설정
  const bannerSlides = [
    { 
      src: homeimage_1, 
      alt: "Home Banner Image 1",
      button: null // 첫 번째 페이지는 버튼 없음
    },
    { 
      src: homeimage_2, 
      alt: "Home Banner Image 2",
      button: {
        text: "자세히 보기",
        link: "/detail-page-2" // 나중에수정
      }
    },
    { 
      src: homeimage_3, 
      alt: "Home Banner Image 3",
      button: {
        text: "신청하기",
        link: "/apply" //나중에 수정
      }
    },
  ];
  
  // 현재 표시될 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 자동 슬라이딩 효과 
  useEffect(() => {
    const interval = setInterval(() => {
      // 다음 이미지로 이동 (마지막 이미지면 처음으로 돌아감)
      setCurrentImageIndex((prevIndex) => 
        prevIndex === bannerSlides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5초마다 이미지 변경
    
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
  }, [bannerSlides.length]);

  // 수동으로 이미지 변경하는 함수
  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };
  
  return (
    <div className="w-full">
      {/* 배너 이미지 슬라이더 섹션 */}
      <FullWidthSection>
        <div className="relative w-full h-full overflow-hidden">
          {bannerSlides.map((slide, index) => (
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
              
              {/* 버튼이 있는 경우에만 표시 (2, 3 페이지만) */}
              {slide.button && (
                <a 
                  href={slide.button.link}
                  className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-10 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors duration-300"
                >
                  {slide.button.text}
                </a>
              )}
            </div>
          ))}
          
          {/* 하단 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {bannerSlides.map((_, index) => (
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
      </FullWidthSection>
      
      <PageLayout>
        컨텐츠들..
      </PageLayout>
    </div>
  );
};

export default Home;