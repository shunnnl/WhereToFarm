import React from 'react';

const NewsCard = ({ imageUrl, title, subtitle, moreLink }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md transition-transform hover:-translate-y-1 duration-300">
      {/* 이미지 섹션 */}
      <div className="h-40 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 콘텐츠 섹션 */}
      <div className="p-4">
        <h3 className="font-semibold text-base mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      
      {/* 푸터 섹션 */}
      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <a href={moreLink} className="text-sm text-gray-500">더보기</a>
      </div>
    </div>
  );
};

export default NewsCard;
