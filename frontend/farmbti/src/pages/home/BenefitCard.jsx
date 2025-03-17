import React from 'react';

// 카드 컴포넌트 - NewsCard와 높이 통일
const Card = ({ icon, title, subtitle, buttonText }) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-64 transition-transform hover:-translate-y-1 duration-300">
      {/* 상단 패딩을 더 추가하여 컨텐츠 중앙 정렬 */}
      <div className="pt-8 pb-2 flex justify-center">
        <div className="text-4xl text-pink-500">
          {icon}
        </div>
      </div>
      
      {/* 본문 컨텐츠 */}
      <div className="px-6 flex-grow flex flex-col items-center">
        <h3 className="text-lg font-bold mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-center">{subtitle}</p>
      </div>
      
      {/* 버튼 영역을 분리하여 푸터처럼 배치 */}
      <div className="px-6 pb-6 mt-auto">
        <button 
          className="flex items-center text-gray-700 hover:text-black transition-colors mx-auto"
          onClick={() => console.log(`${title} 버튼 클릭됨`)}
        >
          <span className="mr-2">{buttonText}</span>
          <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center text-sm">
            {'>'}
          </span>
        </button>
      </div>
    </div>
  );
};

// 혜택 카드 섹션 컴포넌트
const BenefitCards = () => {
  const cardsData = [
    {
      icon: "🔴",
      title: "2025년 하동군",
      subtitle: "축하금 · 생활안정 지금 지원",
      buttonText: "자세히 살펴보기"
    },
    {
      icon: "📚",
      title: "청약군 전입대학생",
      subtitle: "축하금 · 생활안정 지금 지원",
      buttonText: "자세히 살펴보기"
    },
    {
      icon: "🏆",
      title: "완주군 청년 농업인",
      subtitle: "영농정착 지원",
      buttonText: "자세히 살펴보기"
    }
  ];
  
  return (
    <div className="mt-8">
      <div className="flex items-center mb-6">
        <span className="font text-5xl font-bold mb-6">📢 관심있는 혜택을 찾아보세요</span>
        <span className="ml-1 text-gray-500">{'>'}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            icon={card.icon}
            title={card.title}
            subtitle={card.subtitle}
            buttonText={card.buttonText}
          />
        ))}
      </div>
    </div>
  );
};

export default BenefitCards;