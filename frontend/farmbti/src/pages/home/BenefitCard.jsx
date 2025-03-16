import React from 'react';

// 카드 컴포넌트
const Card = ({ icon, title, subtitle, buttonText }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center w-80 h-64 flex-shrink-0 md:w-full md:max-w-md">
      <div className="mb-4 text-4xl text-pink-500">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center mb-6">{subtitle}</p>
      <button 
        className="mt-auto flex items-center text-gray-700 hover:text-black transition-colors"
        onClick={() => console.log(`${title} 버튼 클릭됨`)}
      >
        <span className="mr-2">{buttonText}</span>
        <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center text-sm">
          {'>'}
        </span>
      </button>
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
      
      <div className="flex flex-row space-x-4 overflow-x-auto pb-4 md:justify-between md:overflow-visible">
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