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
  const itemsPerPage = 10;

  const [isFiltered, setIsFiltered] = useState(false);

  // 도(province) 목록을 KoreaCityData에서 가져오기
  const provinces = Object.keys(KoreaCityData);

  // 초기 로드 및 페이지 변경 시 데이터 로드
  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFiltered) {
      // 필터링된 상태에서 페이지네이션
      getFilteredPropertiesWithPagination(activePage);
    } else {
      // 전체 데이터 페이지네이션
      getProperties(activePage);
    }
  }, [activePage, isFiltered]);

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
      const response = await getAllEstate(page - 1, itemsPerPage);
      setProperties(response.content);
      setTotalItemsCount(response.totalElements);
    } catch (error) {
      console.error("매물 데이터를 불러오는 중 오류가 발생했습니다:", error);
      setError("매물 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 필터링 상태에서 페이지네이션 처리하는 함수
  const getFilteredPropertiesWithPagination = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFilteredEstate(
        selectedProvince,
        selectedCity,
        page - 1,
        itemsPerPage
      );

      if (response.content && response.totalElements) {
        setProperties(response.content);
        setTotalItemsCount(response.totalElements);
      } else {
        setProperties(response);
        setTotalItemsCount(response.length);
      }
    } catch (error) {
      // 에러 처리
      console.error(
        "필터링된 매물 데이터를 불러오는 중 오류가 발생했습니다:",
        error
      );
      setError("필터링된 매물 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 페이지 번호 상태 업데이트
    setActivePage(pageNumber);
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
    if (selectedProvince) {
      setIsFiltered(true);
      getFilteredPropertiesWithPagination(1);
    } else {
      setIsFiltered(false);
      getProperties(1);
    }
    setActivePage(1); // 필터링 시 첫 페이지로 돌아가기
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <PageHeader
        title="매물 보기"
        description="귀농 주거지 매물을 찾아보세요."
      />
      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              부동산 매물 목록
            </h2>
            <div className="text-sm text-gray-500">
              총 <span className="font-medium text-green-700">{totalItemsCount}</span>개의 매물
            </div>
          </div>

          {/* 필터 섹션 */}
          <div className="p-4 border-b border-gray-100 flex justify-end gap-2">
            {/* 도(province) 선택 드롭다운 */}
            <select
              className="block w-40 rounded border border-gray-300 focus:border-green-500 focus:ring-green-500"
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
              className="block w-40 rounded border border-gray-300 focus:border-green-500 focus:ring-green-500"
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
              className="px-4 py-2 bg-primaryGreen text-white rounded hover:bg-primaryGreen/90 transition-colors"
              onClick={handleFilter}
            >
              필터 적용
            </button>
          </div>

          {/* 매물 카드 목록 */}
          <div className="max-w-3xl mx-auto space-y-4 p-4 min-h-[500px]">
            {loading ? (
              // 로딩 중에는 이 부분만 표시
              <div className="py-12 flex justify-center items-center">
                <LoadingSpinner text="매물 정보 불러오는 중..." />
              </div>
            ) : error ? (
              // 에러 발생 시
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  className="mt-4 px-4 py-2 bg-primaryGreen text-white rounded-md hover:bg-primaryGreen/90"
                  onClick={() => getProperties(activePage)}
                >
                  다시 시도
                </button>
              </div>
            ) : properties.length > 0 ? (
              // 매물 데이터가 있는 경우
              properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={{
                    ...property,
                    realtor: property.agency,
                    features: property.feature,
                  }}
                />
              ))
            ) : (
              // 검색 결과가 없는 경우
              <div className="py-16 text-center text-gray-500">
                등록된 매물이 없습니다.
              </div>
            )}
          </div>

          {/* 페이지네이션 컴포넌트 */}
          {!loading && !error && totalItemsCount > itemsPerPage && (
            <div className="p-4 border-t border-gray-200">
              <PaginationComponent
                activePage={activePage}
                totalItemsCount={totalItemsCount}
                onChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                className="flex justify-center"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstatePage;