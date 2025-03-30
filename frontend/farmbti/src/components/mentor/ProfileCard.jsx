import React, { useState } from 'react';
import MentorSelectModal from './MentorSelectModal';

const ProfileCard = ({ mentor, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 멘토 객체에서 필요한 정보 추출
  const {
    name,
    profileImage,
    address,
    cropNames = [],
    farmingYears,
    bio
  } = mentor || {};
  
  // 프로필 이미지가 없는 경우 기본 이미지 사용
  const imageSrc = profileImage || "/default-profile.png";
  
  // 농사 경력 계산 (현재 연도 - farmingYears)
  const currentYear = new Date().getFullYear();
  const experience = farmingYears ? (currentYear - farmingYears) : 0;
  
  // 모달 열기 함수
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <div 
        className={`
          bg-white 
          rounded-2xl
          shadow-md
          p-6
          flex
          flex-col
          items-center
          transition-all
          duration-300
          hover:shadow-lg
          w-full
          h-[480px]
          ${className}
          cursor-pointer
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openModal}
      >
        {/* 원형 이미지 */}
        <div className="w-32 h-32 rounded-full border-4 border-green-100 overflow-hidden bg-green-100 mt-4">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* 이름 */}
        <div className="mt-4 text-center">
          <p className="text-xl font-bold">
            {name}
            <span className="text-gray-500 text-lg ml-1">멘토</span>
          </p>
        </div>
        
        {/* 지역 태그 */}
        {address && (
          <div className="mt-3">
            <span className="
              bg-green-100
              text-green-800
              px-3
              py-1
              rounded-full
              text-sm
            ">
              # {address}
            </span>
          </div>
        )}
        
        {/* 작물 정보 */}
        {cropNames && cropNames.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {cropNames.map((crop, index) => (
              <span 
                key={index}
                className="
                  bg-green-50
                  text-green-700
                  px-2
                  py-1
                  rounded-full
                  text-xs
                "
              >
                {crop}
              </span>
            ))}
          </div>
        )}
        
        {/* 경력 정보 */}
        {experience > 0 && (
          <div className="mt-2 text-gray-600 text-sm">
            <span>농사 경력 {experience}년</span>
          </div>
        )}
        
        {/* 짧은 소개 */}
        {bio && (
          <div className="mt-3 text-center text-gray-700 text-sm overflow-hidden">
            {bio.length > 100 ? bio.substring(0, 100) + '...' : bio}
          </div>
        )}
      </div>
      
      {/* 멘토 선택 모달 */}
      <MentorSelectModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        mentor={mentor}
      />
    </>  
  );
};

export default ProfileCard;