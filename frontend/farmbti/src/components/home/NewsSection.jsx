import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from './NewsCard';
import { getTop3News } from '../../API/etc/NewsAPI';


const NewsSection = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getTop3News();
        setNewsItems(data);
      } catch (err) {
        setError("뉴스를 불러오는 데 실패했습니다.");
        console.error("뉴스 데이터 요청 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryGreen"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        <p className="font-bold">오류가 발생했습니다</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-16 mb-12">
      {/* 뉴스 헤더 섹션 */}
      <Link 
        to="/news" 
        className="group inline-flex items-center gap-2 mb-8 hover:text-primaryGreen transition-colors cursor-pointer"
      >
        <span className="font text-4xl font-bold mb-6">📰 더 많은 귀농 소식이 있어요</span>
        <svg 
          className="w-7 h-7 -mt-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </Link>
      
      {/* 뉴스 카드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {newsItems.map((item, index) => (
          <NewsCard 
            key={item.link || index}
            image={item.image}
            title={item.title}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSection; 