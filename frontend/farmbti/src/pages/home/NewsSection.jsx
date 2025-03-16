import React from 'react';
import NewsCard from './NewsCard';

const NewsSection = ({ newsItems }) => {
  return (
    <div className="mt-8 mb-12">
      {/* 뉴스 헤더 섹션 */}
      <div className="flex items-center mb-4">
        <div className="text-lg mr-2">📰</div>
        <h2 className="text-lg font-semibold">더 많은 귀농 소식이 있어요</h2>
        <span className="ml-1 text-lg">›</span>
      </div>
      
      {/* 뉴스 카드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {newsItems.map(item => (
          <NewsCard 
            key={item.id}
            imageUrl={item.imageUrl}
            title={item.title}
            subtitle={item.subtitle}
            moreLink={item.moreLink}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;