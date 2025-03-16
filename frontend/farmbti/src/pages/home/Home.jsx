import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import BannerSlider from './BannerSlider';
import ServiceIcons from './ServiceIcons';
import { bannerSlides, serviceIcons } from './homeData';

const Home = () => {
  return (
    <div className="w-full">
      {/* 배너 이미지 슬라이더 섹션 */}
      <BannerSlider slides={bannerSlides} />
      
      <PageLayout>
        {/* 아이콘 메뉴와 주요 서비스 텍스트 섹션 */}
        <ServiceIcons icons={serviceIcons} />

      </PageLayout>
    </div>
  );
};

export default Home;