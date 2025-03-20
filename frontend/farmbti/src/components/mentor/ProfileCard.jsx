import React from 'react';
import tmpimage from './tmp/하치와레.jpg'
import { useState } from 'react';

const ProfileCard = ({ 
  name, 
  title, 
  imageSrc = "", 
  tag,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <div className={`
      bg-white 
      rounded-2xl 
      shadow-md 
      p-6 
      flex 
      flex-col 
      items-center 
      w-1/3
      h-96
      ${className}
    `}>
      {/* 원형 이미지 */}
      <div className="w-48 h-48 rounded-full border-4 border-green-100 overflow-hidden bg-green-100 mt-4">
        <img 
          src={imageSrc} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 이름과 직함 */}
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold">
          {name} 
          {title && <span className="text-gray-500 text-lg ml-1">{title}</span>}
        </p>
      </div>
      
      {/* 태그 */}
      {tag && (
        <div className="mt-3">
          <span className="
            bg-green-100 
            text-green-800 
            px-3 
            py-1 
            rounded-full 
            text-xl
          ">
            # {tag}
          </span>
        </div>
      )}
    </div>
  );
};

// 예시 렌더링
const ExampleCard = () => {
  return (
    <div className="p-4 flex justify-center">
      <ProfileCard 
        name="하치와레" 
        title="멘토" 
        tag="서울 용산구"
        imageSrc={tmpimage}
      />
    </div>
  );
};

export default ExampleCard;