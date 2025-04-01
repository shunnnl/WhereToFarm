const BenefitCard = ({ region, title, description }) => {
  // 랜덤 이모지 배열 생성
  const emojis = [
    "✨",
    "🚀",
    "💡",
    "🎯",
    "🌟",
    "🔥",
    "💪",
    "🎉",
    "📱",
    "💼",
    "👨‍💻",
    "🛠️",
    "📊",
    "📈",
    "🔍",
    "🎁",
    "💯",
    "⭐",
  ];

  // 랜덤 이모지 선택
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-64 transition-transform hover:-translate-y-1 duration-300">
      <div className="flex flex-col items-center">
        <div className="text-3xl my-3">{randomEmoji}</div>
        <div className="text-lg text-textColor-gray pb-2">{region}</div>
      </div>

      <div className="px-6 flex-grow flex flex-col items-center">
        <h3
          className="text-lg font-bold mb-2 text-center overflow-hidden text-ellipsis w-full px-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </h3>
        <p
          className="text-gray-600 text-center overflow-hidden w-full px-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </p>
      </div>

      <div className="px-6 pb-6 mt-auto">
        <button
          className="flex items-center text-gray-700 hover:text-black transition-colors mx-auto"
          onClick={() => console.log(`${title} 버튼 클릭됨`)}
        >
          <span className="mr-2">자세히 살펴보기</span>
          <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center text-sm">
            {">"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default BenefitCard;
