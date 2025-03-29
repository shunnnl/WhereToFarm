import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import { publicAxios } from "../../../API/common/TestJsonServer";
import PropertyCard from "../../../components/etc/estate/PropertyCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import PaginationComponent from "../../../components/common/Pagination";

const Estate = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([
    {
      id: 1,
      address: "경기도 양평군 서종면 수입리 123-45",
      type: "단독주택",
      deposit: 2000,
      area: 120.5,
      features: "마당 넓음, 텃밭 있음, 계곡 인접, 2층 구조",
      realtor: "양평부동산",
      price: 80,
    },
    {
      id: 2,
      address: "강원도 홍천군 서면 모곡리 67-89",
      type: "전원주택",
      deposit: 1500,
      area: 95.2,
      features: "통나무집, 황토방, 2대 주차, 전망 좋음",
      realtor: "홍천공인중개사",
      price: 65,
    },
    {
      id: 3,
      address: "충청남도 공주시 계룡면 234-56",
      type: "한옥",
      deposit: 3000,
      area: 150.8,
      features: "정원, 연못, 한옥 스타일, 대형 다락방",
      realtor: "공주부동산",
      price: 100,
    },
  ]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const itemsPerPage = 8;

  // 지역 목록
  const regions = [
    "서울",
    "부산",
    "인천",
    "대구",
    "대전",
    "광주",
    "울산",
    "세종",
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
    fetchProperties(activePage);
  }, [activePage]);

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    setError(null);

    // try {
    //   // JSON Server에서 페이지네이션 데이터 가져오기
    //   // _page: 현재 페이지, _limit: 페이지당 아이템 수
    //   const response = await publicAxios.get("/properties", {
    //     params: {
    //       _page: page,
    //       _limit: itemsPerPage,
    //       ...(selectedRegion && { region_like: selectedRegion }),
    //       ...(searchQuery && { q: searchQuery }),
    //     },
    //   });

    //   // JSON Server는 X-Total-Count 헤더에 총 아이템 수를 반환
    //   const totalCount = parseInt(response.headers["x-total-count"] || "0");
    //   setTotalItemsCount(totalCount);

    //   setProperties(response.data);
    //   setFilteredProperties(response.data);
    // } catch (err) {
    //   console.error("매물 데이터를 불러오는 중 오류가 발생했습니다:", err);
    //   setError("매물 데이터를 불러오는 중 오류가 발생했습니다.");

    // 더미 데이터로 대체 (실제 구현에서는 제거)
    setTimeout(() => {
      setFilteredProperties(properties);
      setTotalItemsCount(properties.length);
      setLoading(false);
    }, 500);
    // } finally {
    //   if (!error) {
    //     setLoading(false);
    //   }
    // }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    // 페이지 변경 시 fetchProperties 함수가 useEffect를 통해 자동 호출됨
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
    fetchProperties(1); // 검색 결과의 첫 페이지 가져오기
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
            onClick={() => fetchProperties(activePage)}
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 검색 결과 수 표시 */}
      {!loading && !error && (
        <div className="m-4">
          <p className="text-gray-600">
            총 {totalItemsCount}개의 매물 중 {filteredProperties.length}개를
            표시하고 있습니다.
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

export default Estate;
