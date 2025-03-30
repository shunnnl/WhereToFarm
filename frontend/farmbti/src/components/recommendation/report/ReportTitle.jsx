import React from 'react';

const ReportTitle = ({ farmerType }) => {
  const { id, title } = farmerType;
  
  // 동적 이미지 import
  const getImageUrl = (id) => {
    try {
      const imageUrl = new URL(
        `../../../asset/recommendation/report/farmer${String(id).padStart(2, '0')}.png`, 
        import.meta.url
      ).href;
      console.log('Image URL:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error loading image:', error);
      return '';
    }
  };

  return (
    <>
      {/* 흰색 상단 여백 */}
      <div className="h-16"></div>
      
      {/* 메인 배너 */}
      <div className="relative bg-gradient-to-r from-[#7AB98E] to-[#3B6E54] h-32">
        {/* 농부 이미지 */}
        <div className="absolute -top-16 left-8">
          <img
            src={getImageUrl(id)}
            alt={title}
            className="h-48 object-contain"
            onError={(e) => {
              console.error('Image failed to load:', e);
              console.log('Failed image path:', e.target.src);
            }}
          />
        </div>
        
        {/* 텍스트 영역 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="text-white/90 text-xl font-medium mb-1">
            당신의 귀농 유형은
          </h2>
          <h1 className="text-white text-3xl font-bold">
            {title} <span className="ml-2">농부입니다</span>
          </h1>
        </div>
      </div>
    </>
  );
};

export default ReportTitle;