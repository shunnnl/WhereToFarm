import React, { useState, useEffect } from 'react';
import PageHeader from "../../components/common/PageHeader";

const Estate = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);

  // 더미 매물 데이터 (직접 코드에 포함)
  const properties = [
    {
      "id": 1,
      "주소": "부산광역시 기장군 철마면 구칠리 산 75-131",
      "공인중개사무소명": "영광공인중개사무소",
      "보증금액": "10,500",
      "면적": "1,054.0",
      "매물특징": "기장 철마면 구칠리 토지 매매",
      "지역": "부산광역시 기장군",
      "유형": "주거/농지 / 농지매물"
    },
    {
      "id": 2,
      "주소": "경기도 양평군 서종면 문호리 123-45",
      "공인중개사무소명": "양평부동산",
      "보증금액": "15,000",
      "면적": "890.5",
      "매물특징": "양평 서종면 전원주택 부지",
      "지역": "경기도 양평군",
      "유형": "주거/농지 / 주택매물"
    },
    {
      "id": 3,
      "주소": "전라남도 강진군 도암면 만덕리 456-78",
      "공인중개사무소명": "강진공인중개사",
      "보증금액": "7,800",
      "면적": "1,200.0",
      "매물특징": "강진 도암면 농지 매매, 경작 가능",
      "지역": "전라남도 강진군",
      "유형": "주거/농지 / 농지매물"
    },
    {
      "id": 4,
      "주소": "충청북도 제천시 백운면 평동리 123",
      "공인중개사무소명": "제천부동산",
      "보증금액": "12,300",
      "면적": "920.0",
      "매물특징": "제천 백운면 평동리 전원주택 부지, 계곡 인접",
      "지역": "충청북도 제천시",
      "유형": "주거/농지 / 주택매물"
    },
    {
      "id": 5,
      "주소": "전라북도 완주군 소양면 대흥리 789",
      "공인중개사무소명": "완주부동산",
      "보증금액": "8,500",
      "면적": "1,500.0",
      "매물특징": "완주 소양면 넓은 농지, 주변 편의시설 우수",
      "지역": "전라북도 완주군",
      "유형": "주거/농지 / 농지매물"
    }
  ];

  // 지역 목록
  const regions = [
    '서울', '부산', '인천', '대구', '대전', '광주', '울산', '세종',
    '경기도', '강원도', '충청북도', '충청남도',
    '전라북도', '전라남도', '경상북도', '경상남도', '제주도'
  ];

  // 초기 데이터 설정
  useEffect(() => {
    setFilteredProperties(properties);
  }, []);

  // 필터링 함수
  useEffect(() => {
    filterProperties();
  }, [selectedRegion, searchQuery]);

  const filterProperties = () => {
    let filtered = [...properties];

    // 지역 필터링
    if (selectedRegion) {
      filtered = filtered.filter(property => 
        property.지역?.includes(selectedRegion)
      );
    }

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(property => 
        property.주소?.includes(searchQuery) || 
        property.매물특징?.includes(searchQuery) ||
        property.유형?.includes(searchQuery)
      );
    }

    setFilteredProperties(filtered);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    filterProperties();
  };

  // 매물 카드 컴포넌트
  const PropertyCard = ({ property }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-green-800 mb-2 truncate">{property.주소}</h3>
          <p className="text-sm text-gray-500">{property.유형}</p>
        </div>
        
        <div className="grid gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">보증금액</p>
            <p className="font-semibold">{property.보증금액} 만원</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">면적</p>
            <p className="font-semibold">{property.면적} m²</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">매물특징</p>
          <p className="text-gray-800">{property.매물특징}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">{property.공인중개사무소명}</span>
          <button className="px-3 py-1 bg-green-800 text-white text-sm rounded hover:bg-green-700">
            상세보기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <PageHeader
        title="매물 보기"
        description="귀농 주거지 매물을 찾아보세요."
      />
      
      <div className="flex justify-end items-center space-x-2 p-4 mb-6">
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
      
      {/* 검색 결과 수 표시 */}
      <div className="mb-4">
        <p className="text-gray-600">총 {filteredProperties.length}개의 매물이 있습니다.</p>
      </div>
      
      {/* 매물 카드 목록 */}
      <div className="space-y-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Estate;