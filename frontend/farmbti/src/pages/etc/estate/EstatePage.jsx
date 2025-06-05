import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import PropertyCard from "../../../components/etc/estate/PropertyCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import PaginationComponent from "../../../components/common/Pagination";
import { getAllEstate, getFilteredEstate } from "../../../API/etc/EstateAPI";
import KoreaCityData from "../../../asset/data/KoreaCityData";
import { handleError } from "../../../utils/ErrorUtil";

const EstatePage = () => {
  // URL 쿼리 파라미터 관리를 위한 훅
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // URL에서 필터 및 페이지 정보 가져오기
  const getParamsFromUrl = useCallback(() => {
    return {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
      province: searchParams.get("province") || "",
      city: searchParams.get("city") || "",
    };
  }, [searchParams]);

  const urlParams = getParamsFromUrl();

  const [selectedProvince, setSelectedProvince] = useState(urlParams.province);
  const [selectedCity, setSelectedCity] = useState(urlParams.city);
  const [cities, setCities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading state true
  const [error, setError] = useState(null);

  // 페이지네이션 상태 - URL에서 초기값 가져오기
  const [activePage, setActivePage] = useState(urlParams.page);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const itemsPerPage = 10;

  // 필터 상태 관리
  const [isFiltered, setIsFiltered] = useState(!!urlParams.province);
  const [filterParams, setFilterParams] = useState({
    province: urlParams.province,
    city: urlParams.city,
  });

  // 도(province) 목록을 KoreaCityData에서 가져오기
  const provinces = Object.keys(KoreaCityData);

  // 도(province) 선택 시 해당 시/군/구 목록 업데이트
  useEffect(() => {
    if (selectedProvince) {
      setCities(KoreaCityData[selectedProvince] || []);
      if (!KoreaCityData[selectedProvince]?.includes(selectedCity)) {
        setSelectedCity(""); // 도 변경 시 선택된 시/군/구가 없으면 초기화
      }
    } else {
      setCities([]);
    }
  }, [selectedProvince, selectedCity]);

  // 페이지 상단으로 스크롤 - 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 매물 데이터 가져오는 함수
  const getProperties = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllEstate(page - 1, itemsPerPage);
        setProperties(response.content);
        setTotalItemsCount(response.totalElements);
      } catch (error) {
        handleError(error);
        console.error("매물 데이터를 불러오는 중 오류가 발생했습니다:", error);
        setError("매물 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  // 필터링 상태에서 페이지네이션 처리하는 함수
  const getFilteredPropertiesWithPagination = useCallback(
    async (page = 1, province, city) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getFilteredEstate(
          province,
          city,
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
        handleError(error);
        console.error(
          "필터링된 매물 데이터를 불러오는 중 오류가 발생했습니다:",
          error
        );
        setError("필터링된 매물 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  // URL 쿼리 파라미터가 변경될 때 데이터 로드
  useEffect(() => {
    const currentParams = getParamsFromUrl();

    // 페이지 번호 상태 업데이트
    setActivePage(currentParams.page);

    // 필터 파라미터가 존재하는지 확인
    const hasFilterParams = !!currentParams.province;
    setIsFiltered(hasFilterParams);

    // 필터 상태 업데이트
    setFilterParams({
      province: currentParams.province,
      city: currentParams.city,
    });

    // 선택된 필터 값 업데이트
    setSelectedProvince(currentParams.province);
    setSelectedCity(currentParams.city);

    // 필터 상태에 따라 데이터 로드
    if (hasFilterParams) {
      getFilteredPropertiesWithPagination(
        currentParams.page,
        currentParams.province,
        currentParams.city
      );
    } else {
      getProperties(currentParams.page);
    }
  }, [
    location.search,
    getParamsFromUrl,
    getProperties,
    getFilteredPropertiesWithPagination,
  ]);

  // 페이지 변경 핸들러 - URL 쿼리 파라미터 업데이트
  const handlePageChange = useCallback(
    (pageNumber) => {
      // 페이지 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" });

      // URL 쿼리 파라미터 업데이트
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", pageNumber);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // 도(province) 변경 핸들러
  const handleProvinceChange = useCallback((e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    if (!province) {
      setSelectedCity("");
    }
  }, []);

  // 시/군/구(city) 변경 핸들러
  const handleCityChange = useCallback((e) => {
    const city = e.target.value;
    setSelectedCity(city);
  }, []);

  // 도/시 필터 적용 핸들러
  const handleFilter = useCallback(() => {
    // URL 쿼리 파라미터 업데이트
    const newParams = new URLSearchParams();
    newParams.set("page", "1"); // 필터 적용 시 항상 1페이지로 이동

    // 도가 선택되었으면 필터링 모드로 전환
    if (selectedProvince) {
      // URL에 필터 파라미터 추가
      newParams.set("province", selectedProvince);
      if (selectedCity) {
        newParams.set("city", selectedCity);
      }
    }

    setSearchParams(newParams);
  }, [selectedProvince, selectedCity, setSearchParams]);

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
              총{" "}
              <span className="font-medium text-green-700">
                {totalItemsCount}
              </span>
              개의 매물
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
          <div className="max-w-3xl mx-auto space-y-4 p-4">
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
                  onClick={() => {
                    if (isFiltered) {
                      getFilteredPropertiesWithPagination(
                        activePage,
                        filterParams.province,
                        filterParams.city
                      );
                    } else {
                      getProperties(activePage);
                    }
                  }}
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

          {properties.length > 0 && !loading && (
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
