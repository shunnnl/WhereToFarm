import React from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { authAxios } from '../../API/common/AxiosInstance';
import MentorRegistrationModal from './MentorRegistrationModal ';
import together from '../../asset/mentor/together.svg';
import { Link } from 'react-router-dom'; 
import { useRef, useEffect, useState } from 'react';

Modal.setAppElement("#root");


const TogetherSection = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { isLoggedIn } = useSelector(state => state.auth);
  // 멘토 등록 버튼 클릭 핸들러
  const handleOpenModal = async () => {
    if (!isLoggedIn) {
      alert('멘토 등록을 위해 로그인이 필요합니다.');
      return;
    }

    try {
      // 멘토 여부 확인을 위한 API 호출
      const response = await authAxios.get('/users/me');
      
      // 전체 응답 로깅
      console.log('API 응답 전체:', response);
      console.log('데이터 타입:', typeof response.data);
      console.log('응답 데이터:', response.data);
      
      // 실제 데이터 구조 확인
      const userData = response.data;
      console.log('isMentor 값:', userData.isMentor);
      console.log('isMentor 타입:', typeof userData.isMentor);
      
      // 상세 디버깅을 위한 엄격한 검사
      if (userData && userData.isMentor === true) {
        console.log('멘토 조건 확인됨 - 이미 멘토입니다');
        alert('이미 멘토로 등록되어 있습니다.');
        return;
      } else {
        console.log('멘토 아님 - 모달 열기 진행');
      }
      
      // 멘토가 아니면 모달 열기
      setModalIsOpen(true);
      
    } catch (error) {
      console.error('멘토 상태 확인 중 오류 발생:', error);
      
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        // 서버 오류 발생 시 사용자에게 알림
        console.error('상세 에러 정보:', error.response || error);
        alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  


    return (
      <div className="bg-gradient-to-br from-[#FFF9E2] to-[#B5A37F] rounded-xl overflow-hidden shadow-md transition-transform hover:-translate-y-1 duration-300 relative min-h-[245px]">
      {/* Content Container */}
      <div className="flex items-center p-8">
        {/* Farmer Illustration */}
        <div className="w-96 h-48">
          <img
            src={together}
            alt="농부 일러스트레이션"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Text Section */}
        <div className="flex-grow pr-6 self-start pt-4 flex flex-col">
          <a className="text-4xl font-bold mb-4 text-black">
            먼저 걸어온 길, 함께 걸어요
          </a>
          <h3 className="text-lg py-2 font-semibold hover:underline text-black">
            귀농에 대한 정보를 함께 나누고 싶다면, 멘토로 등록해
            많은 멘티들과 귀농에 대한 이야기를 나누어 보세요!
          </h3>
          
          <div className="mt-4">
            <button 
              className="bg-white text-amber-800 font-medium py-2 px-4 rounded hover:bg-amber-50 transition-colors duration-300"
              onClick={handleOpenModal}
            >
              멘토 등록하기
              </button>
          </div>
        </div>
      </div>



      {/* 분리된 모달 컴포넌트 사용 */}
      <MentorRegistrationModal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        className="bg-white rounded-xl shadow-lg"
        overlayClassName="fixed inset-0 flex items-center justify-center"      
      />



    </div>

  );
    
  };
  
  export default TogetherSection;