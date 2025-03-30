import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import PropertyCard from "../../../components/etc/estate/PropertyCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import PaginationComponent from "../../../components/common/Pagination";
import { getAllEstate } from "../../../API/etc/EstateAPI";
import { toast } from "react-toastify";

const EstatePage = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const itemsPerPage = 8;

  // 지역 목록
  const regions = [
    "부산광역시",
    "인천광역시",
    "대구광역시",
    "대전광역시",
    "광주광역시",
    "울산광역시",
    "세종특별자치시",
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주도",
  ];

  // 매물 데이터 가져오기 - 페이지네이션 적용
  useEffect(() => {
    getProperties(activePage);
  }, [activePage]);

  // 매물 데이터 가져오는 함수
  const getProperties = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllEstate();
      setProperties(response);
      
    } catch (error) {
      console.error("매물 데이터를 불러오는 중 오류가 발생했습니다:", error);
      setError("매물 데이터를 불러오는 중 오류가 발생했습니다.");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    // 페이지 변경 시 getProperties 함수가 useEffect를 통해 자동 호출됨
  };

  // 지역 변경 핸들러
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setActivePage(1); // 필터링 시 첫 페이지로 돌아가기
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    setActivePage(1); // 검색 시 첫 페이지로 돌아가기
    getProperties(1); // 검색 결과의 첫 페이지 가져오기
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
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
      {loading && <LoadingSpinner text="매물 정보 불러오는 중..." />}

      {/* 에러 메시지 */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-500"
            onClick={() => getProperties(activePage)}
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 검색 결과 수 표시 */}
      {!loading && !error && (
        <div className="m-4">
          <p className="text-gray-600">
            총 {totalItemsCount}개의 매물 중 {properties.length}개를 표시하고
            있습니다.
          </p>
        </div>
      )}

      {/* 매물 카드 목록 */}
      {!loading && !error && (
        <div className="space-y-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  ...property,
                  realtor: property.agency, // PropertyCard 컴포넌트가 'realtor' 필드를 사용한다면
                  features: property.feature, // PropertyCard 컴포넌트가 'features' 필드를 사용한다면
                }}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 페이지네이션 컴포넌트 */}
      {!loading && !error && totalItemsCount > itemsPerPage && (
        <PaginationComponent
          activePage={activePage}
          totalItemsCount={totalItemsCount}
          onChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default EstatePage;
