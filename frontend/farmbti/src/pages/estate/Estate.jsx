import React, { useState } from 'react';
import PageHeader from "../../components/common/PageHeader";

const Estate = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 지역 목록 
  const regions = [
    '서울', '부산', '인천', '대구', '대전', '광주', '울산', '세종',
    '경기도', '강원도', '충청북도', '충청남도',
    '전라북도', '전라남도', '경상북도', '경상남도', '제주도'
  ];
  
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearch = () => {
    // 검색 로직 구현
    console.log('지역:', selectedRegion);
    console.log('검색어:', searchQuery);
  };

  return (
    <div>
      <PageHeader
        title="매물 보기"
        description="귀농 주거지 매물을 찾아보세요."
      />
      <div className="flex justify-end items-center space-x-2 p-4">
        {/* 지역 선택 드롭다운 */}
        <select
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          <option value="">지역 선택</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        
        {/* 검색창 */}
        <input
          type="text"
          className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        
        {/* 검색하기 버튼 */}
        <button
          className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-800"
          onClick={handleSearch}
        >
          검색하기
        </button>
      </div>
    </div>
  );
};

export default Estate;