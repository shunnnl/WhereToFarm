import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import PropertyCard from "../../../components/etc/estate/PropertyCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import PaginationComponent from "../../../components/common/Pagination";
import { getAllEstate, getFilteredEstate } from "../../../API/etc/EstateAPI";
import { toast } from "react-toastify";
import KoreaCityData from "../../../asset/data/KoreaCityData";

const EstatePage = () => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const itemsPerPage = 8;

  // 도(province) 목록을 KoreaCityData에서 가져오기
  const provinces = Object.keys(KoreaCityData);

  // 초기 로드 시 전체 매물 데이터 가져오기
  useEffect(() => {
    getProperties(activePage);
  }, [activePage]);

  // 도(province) 선택 시 해당 시/군/구 목록 업데이트
  useEffect(() => {
    if (selectedProvince) {
      setCities(KoreaCityData[selectedProvince] || []);
      setSelectedCity(""); // 도 변경 시 시/군/구 선택 초기화
    } else {
      setCities([]);
    }
  }, [selectedProvince]);

  // 매물 데이터 가져오는 함수
  const getProperties = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllEstate();
      setProperties(response);
      setTotalItemsCount(response.length);
    } catch (error) {
      console.error("매물 데이터를 불러오는 중 오류가 발생했습니다:", error);
      setError("매물 데이터를 불러오는 중 오류가 발생했습니다.");
      toast.error(error.message || "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 필터링된 매물 데이터 가져오는 함수
  const getFilteredProperties = async () => {
    if (!selectedProvince) {
      // 도(province)가 선택되지 않은 경우 전체 데이터 로드
      getProperties(1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getFilteredEstate(selectedProvince, selectedCity);
      setProperties(response);
      setTotalItemsCount(response.length);
      setActivePage(1); // 필터링 시 첫 페이지로 돌아가기
    } catch (error) {
      console.error(
        "필터링된 매물 데이터를 불러오는 중 오류가 발생했습니다:",
        error
      );
      setError("필터링된 매물 데이터를 불러오는 중 오류가 발생했습니다.");
      toast.error(error.message || "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    // 페이지 변경 시 getProperties 함수가 useEffect를 통해 자동 호출됨
  };

  // 도(province) 변경 핸들러
  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
  };

  // 시/군/구(city) 변경 핸들러
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
  };

  // 도/시 필터 적용 핸들러
  const handleFilter = () => {
    getFilteredProperties();
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <PageHeader
        title="매물 보기"
        description="귀농 주거지 매물을 찾아보세요."
      />

      <div className="flex flex-wrap justify-end items-center gap-2 p-4 mb-6">
        {/* 도(province) 선택 드롭다운 */}
        <select
          className="h-10 w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedProvince}
          onChange={handleProvinceChange}
        >
          <option value="">도 선택</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>

        {/* 시/군/구(city) 선택 드롭다운 */}
        <select
          className="h-10 w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedProvince}
        >
          <option value="">시/군/구 선택</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* 필터 적용 버튼 */}
        <button
          className="h-10 px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-800"
          onClick={handleFilter}
        >
          필터 적용
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