import React from 'react';
import ContentLayout from '../../components/layout/ContentLayout';
import GradientSection from './GradientSection';
const MentorPage = () => {
  return (
    <div className="w-full">
      {/* 배너 이미지 슬라이더 섹션 - 전체 너비 사용 */}
      <ContentLayout fullWidth>
        <GradientSection/>
      </ContentLayout>
      
      {/* 일반 콘텐츠 - 너비 제한과 패딩 적용 */}
      <ContentLayout>


      </ContentLayout>
    </div>
  );
};

export default MentorPage;