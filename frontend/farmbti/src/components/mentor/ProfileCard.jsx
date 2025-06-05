import React, { useState } from 'react';
import MentorSelectModal from './MentorSelectModal';

const ProfileCard = ({ mentor, className = '', regionName = '', cityName = '' }) => {
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
  
  // 지역 정보 표시 생성
  const getLocationDisplay = () => {
    // 상위 컴포넌트에서 지역 정보를 받았다면 해당 정보 사용
    if (regionName || cityName) {
      if (regionName && cityName) {
        return `${regionName} ${cityName}`;
      } else if (regionName) {
        return regionName;
      } else if (cityName) {
        return cityName;
      }
    }
    // 받지 않았다면 멘토 객체의 주소 정보 사용
    return address || '';
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
          relative
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
        
        {/* 지역 태그 - 상위 컴포넌트에서 받은 값 사용 */}
        {getLocationDisplay() && (
          <div className="mt-3">
            <span className="
              bg-green-100
              text-green-800
              px-3
              py-1
              rounded-full
              text-sm
            ">
              # {getLocationDisplay()}
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
        
        {/* 짧은 소개 - 명확한 스타일로 고정 */}
        {bio && (
          <div className="
            mt-4 
            text-center 
            text-gray-700 
            text-sm
            max-h-16
            w-full
            mb-4
            relative
          ">
            <div className="overflow-hidden" style={{ height: '4rem' }}>
              {bio}
            </div>
            {bio && bio.length > 60 && (
              <div className="absolute bottom-0 right-0 left-0 text-right pr-2" style={{ 
                background: 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1) 30%)' 
              }}>
                ...
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 멘토 선택 모달 */}
      <MentorSelectModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        mentor={mentor}
        regionName={regionName}
        cityName={cityName}
      />
    </>
  );
};

export default ProfileCard;