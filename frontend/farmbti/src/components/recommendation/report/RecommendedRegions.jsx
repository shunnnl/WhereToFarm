import React, { useState } from 'react';

const RecommendedRegions = ({ regions }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  return (
    <div className="bg-white rounded-lg p-8 mx-8 mt-8 shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)]">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold mb-3">🌟 FARMbti 맞춤 추천 지역 TOP3 🌟</h2>
        <p className="text-gray-600">
          회원님의 FARM 성향을 분석한 결과, 다음 지역들이 가장 적합할 것 같아요!
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
        {regions.map((region, index) => (
          <button
            key={region.regionName}
            className={`w-full md:w-3/4 p-5 rounded-lg transition-all
              ${selectedRegion?.regionName === region.regionName 
                ? 'bg-[#7AB98E] text-white shadow-lg transform scale-105' 
                : 'bg-white border border-gray-200 hover:border-[#7AB98E] hover:shadow-md hover:scale-102'
              }`}
            onClick={() => setSelectedRegion(region)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {index === 0 && <span className="text-2xl">🥇</span>}
                {index === 1 && <span className="text-2xl">🥈</span>}
                {index === 2 && <span className="text-2xl">🥉</span>}
                <span className="text-lg font-medium">{region.regionName}</span>
              </div>
              {selectedRegion?.regionName !== region.regionName && (
                <span className={`flex items-center gap-2 ${selectedRegion?.regionName === region.regionName ? 'text-white' : 'text-[#7AB98E]'}`}>
                  자세히 보기 <span className="text-xl">→</span>
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* 선택된 지역이 있을 때만 상세 정보 표시 */}
      {selectedRegion && (
        <div className="mt-12 p-6 bg-[#F8F9F3] rounded-lg max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">📍 현재 선택한 지역은</span>
            <span className="text-xl font-bold text-[#7AB98E]">{selectedRegion.regionName}</span>
            <span className="text-xl font-bold">입니다.</span>
          </div>

          {/* 관련 정보 */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <h3 className="flex items-center gap-2 font-bold mb-2">
              📋 관련 정보
            </h3>
            <p className="text-gray-600">{selectedRegion.basicInfo}</p>
          </div>

          {/* 추천 이유와 작물 정보를 수평으로 배치 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 추천 이유 */}
            <div className="bg-[#E8F3E7] p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl font-bold">💡</span>
                <span className="text-xl font-bold">추천 이유</span>
              </div>
              <p className="text-gray-600">{selectedRegion.recommendationReason}</p>
            </div>

            {/* 주요 작물 */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl font-bold">🌾</span>
                <span className="text-xl font-bold">주요 작물</span>
              </div>
              <ul className="space-y-4">
                {selectedRegion.topCrops.map((crop) => (
                  <li key={crop.cropName} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#7AB98E] rounded-full"></span>
                    {crop.cropName}
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