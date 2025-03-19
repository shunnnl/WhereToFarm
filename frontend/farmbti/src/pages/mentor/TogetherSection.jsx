import React from 'react';
import Modal from 'react-modal';
import MentorRegistrationModal from './MentorRegistrationModal ';
import together from '../../asset/mentor/together.svg';
import { Link } from 'react-router-dom'; 
import { useRef, useEffect, useState } from 'react';

Modal.setAppElement("#root");


const TogetherSection = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
            <button className="bg-white text-amber-800 font-medium py-2 px-4 rounded hover:bg-amber-50 transition-colors duration-300"
            onClick={()=> setModalIsOpen(true)}
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
      />



    </div>

  );
    
  };
  
  export default TogetherSection;