import React from 'react';

const NewsCard = ({ image, title, link }) => {
  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl overflow-hidden shadow-md transition-all hover:-translate-y-1 duration-300 relative group h-64"
    >
      {/* 이미지 섹션 */}
      <div className="h-40 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/assets/default-news-image.jpg';
          }}
        />
      </div>
      
      {/* 콘텐츠 섹션 */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2">{title}</h3>
      </div>

      {/* 호버 시 나타나는 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-white font-medium px-4 py-2 rounded-full border-2 border-white hover:bg-white hover:text-black transition-colors">
          자세히 보기
        </span>
      </div>
    </a>
  );
};

export default NewsCard;