import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import Modal from 'react-modal';
import ProfileCard from './ProfileCard';
import { authAxios } from '../../API/common/AxiosInstance';
import MentorSelectModal from './MentorSelectModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MentorSelect = ({ candidateList, regionName, cityName }) => {
  // 멘토 목록 상태 관리
  const [mentors, setMentors] = useState([]);
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  // 에러 상태 관리
  const [error, setError] = useState(null);
  // 데이터 없음 메시지
  const [noDataMessage, setNoDataMessage] = useState(null);
  // 모달 관련 상태
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  // 캐러셀 관련 참조
  const carouselRef = useRef(null);
  

  
  // 모달 열기 함수
  const openModal = (mentor) => {
    setSelectedMentor(mentor);
    setModalIsOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // 캐러셀 스크롤 함수
  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300; // 대략적인 카드 하나의 너비
      
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };
  
  

  // cityName이 변경될 때마다 API 호출
  useEffect(() => {
    // cityName이 있을 때만 API 호출
    if (cityName) {
      fetchMentorsByLocation(cityName);
    } else {
      // cityName이 없으면 상태 초기화
      setMentors([]);
      setNoDataMessage(null);
      setError(null);
    }
  }, [cityName]);

  // 멘토 데이터 가져오기
  const fetchMentorsByLocation = async (city) => {
    setIsLoading(true);
    setError(null);
    setNoDataMessage(null);
    
    try {
      // 디버깅을 위한 로그
      console.log('도시명으로 멘토 조회 요청:', city);
      
      // API 요청
      const response = await authAxios.post('/mentors/by-location', { city: city });
      
      // 응답 로깅
      console.log('API 응답 전체 객체:', response);
      
      // 기본 응답 구조 확인
      if (!response || !response.data) {
        setError("멘토정보가 없습니다");
        return;
      }
      
      const responseData = response.data;
      console.log('서버 응답 데이터:', responseData);
      
      // 응답이 배열인 경우 (직접 멘토 데이터가 오는 경우)
      if (Array.isArray(responseData)) {
        if (responseData.length === 0) {
          setNoDataMessage("해당 지역에 멘토가 없습니다");
        } else {
          setMentors(responseData);
        }
        return;
      }
      
      // 응답이 success/data/error 형태인 경우
      if (responseData && typeof responseData === 'object') {
        // 지역에 멘토가 없는 경우 (NO_MENTORS_IN_LOCATION)
        if (responseData.success === false && 
            responseData.error && 
            responseData.error.code === "NO_MENTORS_IN_LOCATION") {
          setNoDataMessage(responseData.error.message);
          return;
        }
        
        // 다른 에러인 경우
        if (responseData.success === false && responseData.error) {
          setError(responseData.error.message);
          return;
        }
        
        // 성공 케이스지만 데이터가 없는 경우
        if (responseData.success === true && 
            (!responseData.data || responseData.data.length === 0)) {
          setNoDataMessage("멘토 데이터가 없습니다");
          return;
        }
        
        // 성공 케이스이고 데이터가 있는 경우
        if (responseData.success === true && responseData.data) {
          setMentors(responseData.data);
          return;
        }
      }
      
      // 예상치 못한 응답 형식
      setError("예상치 못한 응답 형식입니다");
      
    } catch (err) {
      console.error('멘토 정보 로딩 에러:', err);
      
      // 서버 응답이 있는 에러
      if (err.response) {
        console.error('에러 응답 상태:', err.response.status);
        console.error('에러 데이터:', err.response.data);
        
        // 응답에 에러 메시지가 있으면 사용
        if (err.response.data && err.response.data.error && err.response.data.error.message) {
          setError(err.response.data.error.message);
        } else {
          setError(`서버 오류 (${err.response.status})`);
        }
      } 
      // 네트워크 오류 등
      else {
        setError(err.message || "멘토 정보를 불러오는데 문제가 발생했습니다");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-auto"
      style={{
        backgroundColor: 'rgba(229, 245, 202, 0.59)',
        borderRadius: '8px',
        boxShadow: '0 0 20px 10px rgba(229, 245, 202, 0.8)'
      }}>
      {/* 내부 콘텐츠 */}
      <div className="w-full h-full p-4">
        <h2 className="text-xl font-semibold mb-4">
          <span className="text-green-600">{cityName || '선택된 지역이 없습니다'}</span> 
          {cityName && ' 지역 멘토'}
        </h2>
        
        {/* 로딩 상태 표시 */}
        {isLoading && (
          <div className="text-center py-4">
            <p>멘토 정보를 불러오는 중입니다...</p>
          </div>
        )}
        
        {/* 에러 메시지 표시 */}
        {error && (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
        
        {/* 데이터 없음 메시지 표시 */}
        {!isLoading && !error && noDataMessage && (
          <div className="text-center py-4 text-gray-600">
            <p>{noDataMessage}</p>
          </div>
        )}
        
        {/* 멘토 목록 캐러셀로 표시 */}
        {!isLoading && !error && !noDataMessage && mentors.length > 0 && (
          <div className="relative w-full mt-4">
            {/* 왼쪽 화살표 */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              onClick={() => scroll('left')}
              aria-label="이전 멘토"
            >
              <ChevronLeft size={24} className="text-green-600" />
            </button>
            
            {/* 캐러셀 컨테이너 */}
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto gap-4 pb-4 px-10 scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none' 
              }}
            >
              {mentors.map((mentor) => (
                <div 
                  key={mentor.mentorId} 
                  className="min-w-[280px] max-w-[280px] flex-shrink-0"
                >
                  <ProfileCard mentor={mentor} />
                </div>
              ))}
            </div>
            
            {/* 오른쪽 화살표 */}
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              onClick={() => scroll('right')}
              aria-label="다음 멘토"
            >
              <ChevronRight size={24} className="text-green-600" />
            </button>
          </div>
        )}
        
        {/* 멘토 상세 정보 모달 */}
        <MentorSelectModal 
          isOpen={modalIsOpen}
          onClose={closeModal}
          mentor={selectedMentor}
          className="bg-white rounded-xl shadow-lg"
          overlayClassName="fixed inset-0 flex items-center justify-center"
        />
      </div>
      
      {/* 스크롤바 숨기기 위한 스타일 */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MentorSelect;
