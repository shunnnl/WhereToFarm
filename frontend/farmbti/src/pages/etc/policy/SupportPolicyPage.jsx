import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import PolicyCard from "../../../components/etc/policy/PolicyCard";
import PaginationComponent from "../../../components/common/Pagination";
import {
  getAllPolicyList,
  getRegionPolicyList,
} from "../../../API/etc/PolicyAPI";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { toast } from "react-toastify";
import KoreaCityData from "../../../asset/data/KoreaCityData";
import { handleError } from "../../../utils/ErrorUtil";

const SupportPolicyPage = () => {
  const [allPolicies, setAllPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  // 지역 필터 상태
  const [selectedDo, setSelectedDo] = useState("");
  const [selectedSiGunGu, setSelectedSiGunGu] = useState("");
  const [siGunGuList, setSiGunGuList] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 도 선택 시 시군구 리스트 업데이트
  useEffect(() => {
    if (selectedDo) {
      setSiGunGuList(KoreaCityData[selectedDo] || []);
      setSelectedSiGunGu("");
    } else {
      setSiGunGuList([]);
      setSelectedSiGunGu("");
    }
  }, [selectedDo]);

  // 초기 로드 및 페이지 변경 시 데이터 로드
  useEffect(() => {
    if (isFiltering) {
      // 필터링된 상태에서 페이지네이션
      getFilteredPoliciesWithPagination(activePage);
    } else {
      // 전체 데이터 페이지네이션
      getPolicies(activePage);
    }
  }, [activePage, isFiltering]);

  // 정책 데이터 가져오는 함수
  const getPolicies = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllPolicyList(page - 1, itemsPerPage);

      if (response?.content) {
        setAllPolicies(response.content);
        setTotalElements(response.totalElements);
      } else {
        setError("정책 정보를 불러오는데 실패했습니다.");
        toast.error("정책 정보를 불러오는데 실패했습니다.");
        setAllPolicies([]);
      }
    } catch (err) {
      handleError(err);
      setError("서버 오류가 발생했습니다.");
      toast.error(err.message || "정책 목록을 불러오는데 실패했습니다.");
      setAllPolicies([]);
      console.error("Error fetching policies:", err);
    } finally {
      setLoading(false);
    }
  };

  // 필터링 상태에서 페이지네이션 처리하는 함수
  const getFilteredPoliciesWithPagination = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRegionPolicyList(
        page - 1,
        itemsPerPage,
        selectedDo,
        selectedSiGunGu
      );

      if (response?.content) {
        setAllPolicies(response.content);
        setTotalElements(response.totalElements);
      } else {
        setError("필터링된 정책 정보를 불러오는데 실패했습니다.");
        toast.error("필터링된 정책 정보를 불러오는데 실패했습니다.");
        setAllPolicies([]);
      }
    } catch (err) {
      handleError(err);
      setError("서버 오류가 발생했습니다.");
      toast.error(
        err.message || "필터링된 정책 목록을 불러오는데 실패했습니다."
      );
      setAllPolicies([]);
      console.error("Error fetching filtered policies:", err);
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

  // 필터 적용 핸들러
  const handleFilterApply = () => {
    if (selectedDo) {
      setIsFiltering(true);
      getFilteredPoliciesWithPagination(1);
    } else {
      setIsFiltering(false);
      getPolicies(1);
    }
    setActivePage(1); // 필터링 시 첫 페이지로 돌아가기
  };

  // 도 선택 핸들러
  const handleDoChange = (e) => {
    const value = e.target.value;
    setSelectedDo(value);
    setSelectedSiGunGu("");
  };

  // 시/군/구 선택 핸들러
  const handleSiGunGuChange = (e) => {
    setSelectedSiGunGu(e.target.value);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <PageHeader title="지원 정책" description="관심있는 혜택을 찾아보세요." />

      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              지원 정책 목록
            </h2>
            <div className="text-sm text-gray-500">
              총{" "}
              <span className="font-medium text-green-700">
                {totalElements}
              </span>
              개의 정책
            </div>
          </div>

          {/* 필터 섹션 */}
          <div className="p-4 border-b border-gray-100 flex justify-end gap-2">
            <select
              className="block w-40 rounded border border-gray-300 focus:border-green-500 focus:ring-green-500"
              value={selectedDo}
              onChange={handleDoChange}
            >
              <option value="">도 선택</option>
              {Object.keys(KoreaCityData).map((do_name) => (
                <option key={do_name} value={do_name}>
                  {do_name}
                </option>
              ))}
            </select>

            <select
              className="block w-40 rounded border border-gray-300 focus:border-green-500 focus:ring-green-500"
              value={selectedSiGunGu}
              onChange={handleSiGunGuChange}
              disabled={!selectedDo}
            >
              <option value="">시/군/구 선택</option>
              {siGunGuList.map((siGunGu) => (
                <option key={siGunGu} value={siGunGu}>
                  {siGunGu}
                </option>
              ))}
            </select>

            <button
              onClick={handleFilterApply}
              className="px-4 py-2 bg-primaryGreen text-white rounded hover:bg-primaryGreen/90 transition-colors"
            >
              필터 적용
            </button>
          </div>

          {/* 정책 카드 목록 */}
          <div className="max-w-3xl mx-auto space-y-4 p-4 min-h-[500px]">
            {loading ? (
              // 로딩 중에는 이 부분만 표시
              <div className="py-12 flex justify-center items-center">
                <LoadingSpinner text="정책 정보 불러오는 중..." />
              </div>
            ) : error ? (
              // 에러 발생 시
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  className="mt-4 px-4 py-2 bg-primaryGreen text-white rounded-md hover:bg-primaryGreen/90"
                  onClick={() => getPolicies(activePage)}
                >
                  다시 시도
                </button>
              </div>
            ) : allPolicies.length > 0 ? (
              // 정책 데이터가 있는 경우
              allPolicies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))
            ) : (
              // 검색 결과가 없는 경우
              <div className="py-16 text-center text-gray-500">
                등록된 정책이 없습니다.
              </div>
            )}
          </div>

          {/* 페이지네이션 컴포넌트 */}
          {!loading && !error && totalElements > itemsPerPage && (
            <div className="p-4 border-t border-gray-200">
              <PaginationComponent
                activePage={activePage}
                totalItemsCount={totalElements}
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

export default SupportPolicyPage;
