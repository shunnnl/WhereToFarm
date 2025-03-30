import React, { useState } from 'react';

const RecommendedRegions = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regions = [
    {
      id: 1,
      name: '보은군',
      image: '/assets/regions/boeun.jpg',
      info: '보은시는 경상북도 남동부에 위치한 시로, 또한 바다와 인접한 기후와 낮은 기온차 덕분에 포도를 잘 재배하는 지역입니다.',
      crops: ['옥수수', '당근', '양배추'],
      benefits: [
        '영천시 청년 귀농 정착 지원금 지원',
        '영천시 청년 귀농 정착 지원금 지원'
      ]
    },
    {
      id: 2,
      name: '남원시',
      image: '/assets/regions/namwon.jpg',
      info: '남원시 관련 정보...',
      crops: ['옥수수', '당근', '양배추'],
      benefits: ['남원시 청년 귀농 정착 지원금 지원']
    },
    {
      id: 3,
      name: '영천시',
      image: '/assets/regions/yeongcheon.jpg',
      info: '영천시 관련 정보...',
      crops: ['옥수수', '당근', '양배추'],
      benefits: ['영천시 청년 귀농 정착 지원금 지원']
    }
  ];

  return (
    <div className="bg-white rounded-lg p-8 mx-8 mt-8 shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)]">
      <h2 className="text-xl font-bold mb-6">
        <span className="text-[#7AB98E]">소확행 농부</span> 인 당신에게 어울리는 지역
      </h2>
      
      <div className="flex gap-8">
        {/* 왼쪽: 지도 */}
        <div className="w-1/2 bg-[#1B4B2E] rounded-lg p-4">
          <img 
            src="/assets/regions/korea-map.png" 
            alt="한국 지도" 
            className="w-full"
          />
        </div>

        {/* 오른쪽: 지역 리스트 */}
        <div className="w-1/2 space-y-4">
          <p className="text-gray-600 mb-4">더 궁금하고 싶은 도시를 선택해주세요</p>
          {regions.map((region) => (
            <button
              key={region.id}
              className={`flex items-center gap-4 w-full p-4 rounded-lg border transition-all
                ${selectedRegion?.id === region.id 
                  ? 'bg-[#7AB98E] text-white border-transparent' 
                  : 'bg-white border-gray-200 hover:border-[#7AB98E]'
                }`}
              onClick={() => setSelectedRegion(region)}
            >
              <img 
                src={region.image} 
                alt={region.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="font-medium">{region.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 지역 상세 정보 */}
      {selectedRegion && (
        <div className="mt-8 p-6 bg-[#F8F9F3] rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">📍 현재 선택한 지역은</span>
            <span className="text-xl font-bold text-[#7AB98E]">{selectedRegion.name}</span>
            <span className="text-xl font-bold">입니다.</span>
          </div>

          {/* 관련 정보 */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="flex items-center gap-2 font-bold mb-2">
              📋 관련 정보
            </h3>
            <p className="text-gray-600">{selectedRegion.info}</p>
          </div>

          {/* 많이 키우는 작물과 혜택을 수평으로 배치 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 많이 키우는 작물 */}
            <div className="bg-[#E8F3E7] p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl font-bold">🌾</span>
                <span className="text-xl font-bold">많이 키우는 작물임</span>
              </div>
              <div className="flex flex-col gap-4">
                {selectedRegion.crops.map((crop, index) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    {crop}
                  </div>
                ))}
              </div>
            </div>

            {/* 혜택 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl font-bold">💝</span>
                <span className="text-xl font-bold">맞춤 혜택</span>
              </div>
              <ul className="space-y-4">
                {selectedRegion.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#7AB98E] rounded-full"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendedRegions; 