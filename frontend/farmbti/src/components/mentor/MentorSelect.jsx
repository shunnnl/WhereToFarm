import React from 'react';
import { useState } from 'react';
import Modal from 'react-modal';
import ProfileCard from './ProfileCard'

const MentorSelect = ({ candidateList, regionName, cityName }) => {
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
                  <span className="text-green-600">{regionName} {cityName}</span> 지역 멘토 
              </h2>

        {/* 콘텐츠 내용 */}
        <ProfileCard/>

      </div>
    </div>
  );

};

export default MentorSelect;