import React, { useState, useEffect } from 'react';
import PageHeader from "../../../components/common/PageHeader";
import { publicAxios } from "../../../API/common/TestJsonServer";
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const Estate = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 지역 목록
  const regions = [
    '서울', '부산', '인천', '대구', '대전', '광주', '울산', '세종',
    '경기도', '강원도', '충청북도', '충청남도',
    '전라북도', '전라남도', '경상북도', '경상남도', '제주도'
  ];
  
  // 매물 데이터 가져오기
  useEffect(() => {
    fetchProperties();
  }, []);
  
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    
    // try {
    //   // JSON Server에서 데이터 가져오기
    //   const response = await publicAxios.get('/properties');
    //   setProperties(response);
    //   setFilteredProperties(response);
    // } catch (err) {
    //   console.error('매물 데이터를 불러오는 중 오류가 발생했습니다:', err);
    //   setError('매물 데이터를 불러오는 중 오류가 발생했습니다.');
    // } finally {
    //   setLoading(false);
    // }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  
  // 필터링 함수
  useEffect(() => {
    if (!selectedRegion && !searchQuery) {
      setFilteredProperties(properties);
      return;
    }
    
    filterProperties();
  }, [selectedRegion, searchQuery, properties]);
  
  const filterProperties = () => {
    if (!properties.length) return;
    
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
  
  // JSON Server의 필터링 기능 사용하기
  const fetchPropertiesByRegion = async (region) => {
    setLoading(true);
    setError(null);
    
    try {
      // JSON Server는 _like로 부분 일치 필터링 지원
      const response = await publicAxios.get('/properties', {
        params: { 지역_like: region }
      });
      setProperties(response);
      setFilteredProperties(response);
    } catch (err) {
      console.error('지역별 매물 데이터를 불러오는 중 오류가 발생했습니다:', err);
      setError('매물 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    
    // 서버 측 필터링을 사용하려면 이 부분의 주석을 해제
    // if (region) {
    //   fetchPropertiesByRegion(region);
    // } else {
    //   fetchProperties();
    // }
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
          className="h-10 w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
          className="h-10 w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* 검색하기 버튼 */}
        <button
          className="h-10 px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-800"
          onClick={handleSearch}
        >
          검색하기
        </button>
      </div>

      {/* 로딩 상태 */}
      {loading && <LoadingSpinner text="매물 정보 불러오는 중..."/>}

      {/* 에러 메시지 */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-500"
            onClick={fetchProperties}
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 검색 결과 수 표시 */}
      {!loading && !error && (
        <div className="mb-4">
          <p className="text-gray-600">
            총 {filteredProperties.length}개의 매물이 있습니다.
          </p>
        </div>
      )}

      {/* 매물 카드 목록 */}
      {!loading && !error && (
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
      )}
    </div>
  );
};

export default Estate;