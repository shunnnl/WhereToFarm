import React from 'react';
import ContentLayout from '../../components/layout/ContentLayout';
import BannerSlider from '../../components/home/BannerSlider';
import ServiceIcons from '../../components/home/ServiceIcons';
import BenefitSection from "../../components/home/BenefitSection";
import NewsSection from '../../components/home/NewsSection';
import Mentor  from '../../components/home/Mentor';
import Calculator from '../../components/home/Calculator'
import { bannerSlides, serviceIcons, newsItems } from '../../components/home/homeData';


const Home = () => {
  return (
    <div className="w-full">
      {/* 배너 이미지 슬라이더 섹션 - 전체 너비 사용 */}
      <ContentLayout fullWidth>
        <BannerSlider slides={bannerSlides} />
      </ContentLayout>
      
      {/* 일반 콘텐츠 - 너비 제한과 패딩 적용 */}
      <ContentLayout>
        {/* 아이콘 메뉴와 주요 서비스 텍스트 섹션 */}
        <ServiceIcons icons={serviceIcons} />

        {/* 관심있는 혜택 섹션 */}
        <BenefitSection/>

        {/* 귀농뉴스 섹션 */}
        <NewsSection newsItems={newsItems} />

        {/* 하단 바로가기 섹션 */}
        <div className="space-y-6">
          <Mentor/>
          <Calculator/>
        </div>

      </ContentLayout>
    </div>
  );
};

export default Home;