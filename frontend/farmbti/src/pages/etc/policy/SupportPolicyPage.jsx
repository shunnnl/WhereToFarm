import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import PolicyCard from '../../../components/etc/policy/PolicyCard';
import PaginationComponent from '../../../components/common/Pagination';
import { getAllPolicyList, getRegionPolicyList } from '../../../API/etc/PolicyAPI';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import KoreaCityData from '../../../asset/data/KoreaCityData';

const SupportPolicyPage = () => {
  const [allPolicies, setAllPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  // 지역 필터 상태
  const [selectedDo, setSelectedDo] = useState('');
  const [selectedSiGunGu, setSelectedSiGunGu] = useState('');
  const [siGunGuList, setSiGunGuList] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterParams, setFilterParams] = useState({ do_: '', city: '' });

  // 도 선택 시 시군구 리스트 업데이트
  useEffect(() => {
    if (selectedDo) {
      setSiGunGuList(KoreaCityData[selectedDo] || []);
      setSelectedSiGunGu('');
    } else {
      setSiGunGuList([]);
      setSelectedSiGunGu('');
    }
  }, [selectedDo]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        let response;
        
        if (isFiltering) {
          // 지역 필터링
          response = await getRegionPolicyList(
            activePage - 1, 
            itemsPerPage, 
            filterParams.do_, 
            filterParams.city
          );
        } else {
          // 전체 조회
          response = await getAllPolicyList(activePage - 1, itemsPerPage);
        }
        
        console.log('API Response:', response);
        
        if (response?.content) {
          setAllPolicies(response.content);
          setTotalElements(response.totalElements);
          setError(null);
        } else {
          setError('정책 정보를 불러오는데 실패했습니다.');
          toast.error('정책 정보를 불러오는데 실패했습니다.');
          setAllPolicies([]);
        }
      } catch (err) {
        setError('서버 오류가 발생했습니다.');
        toast.error(err.message || '정책 목록을 불러오는데 실패했습니다.');
        setAllPolicies([]);
        console.error('Error fetching policies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [activePage, isFiltering, filterParams]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 필터 적용 핸들러
  const handleFilterApply = () => {
    setActivePage(1);
    setIsFiltering(true);
    setFilterParams({
      do_: selectedDo,
      city: selectedSiGunGu
    });
  };

  // 도 선택 핸들러
  const handleDoChange = (e) => {
    const value = e.target.value;
    setSelectedDo(value);
    setSelectedSiGunGu('');
    if (!value) {
      setIsFiltering(false);
      setFilterParams({ do_: '', city: '' });
      setActivePage(1);
    }
  };

  // 시/군/구 선택 핸들러
  const handleSiGunGuChange = (e) => {
    setSelectedSiGunGu(e.target.value);
  };

  if (loading) {
    return <LoadingSpinner text="정책 정보 불러오는 중..." />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <PageHeader 
        title="지원 정책" 
        description="관심있는 혜택을 찾아보세요."
      />
      
      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              지원 정책 목록
            </h2>
            <div className="text-sm text-gray-500">
              총 <span className="font-medium text-green-700">{totalElements}</span>개의 정책
            </div>
          </div>

          {/* 필터 섹션 */}
          <div className="p-4 border-b border-gray-100 flex justify-end gap-2">
            <select
              value={selectedDo}
              onChange={handleDoChange}
              className="block w-40 rounded border border-gray-300 focus:border-green-500 focus:ring-green-500"
            >
              <option value="">도 선택</option>
              {Object.keys(KoreaCityData).map((do_name) => (
                <option key={do_name} value={do_name}>
                  {do_name}
                </option>
              ))}
            </select>

            <select
              value={selectedSiGunGu}
              onChange={handleSiGunGuChange}
              className="block w-40 rounded border border-gray-300 focus:border-green-500 focus:ring-green-500"
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

          <div className="max-w-3xl mx-auto space-y-4 p-4">
            {allPolicies.length > 0 ? (
              allPolicies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))
            ) : (
              <div className="py-16 text-center text-gray-500">
                등록된 정책이 없습니다.
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <PaginationComponent
              activePage={activePage}
              totalItemsCount={totalElements}
              onChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              className="flex justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPolicyPage; 