import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import BannerSlider from './BannerSlider';
import ServiceIcons from './ServiceIcons';
import MainServices from './MainServices';
import { bannerSlides, serviceIcons, mainServices } from './homeData';

const Home = () => {
  return (
    <div className="w-full">
      {/* 배너 이미지 슬라이더 섹션 */}
      <BannerSlider slides={bannerSlides} />
      
      <PageLayout>
        {/* 아이콘 메뉴 섹션 */}
        <ServiceIcons icons={serviceIcons} />

        {/* 주요 서비스 섹션 */}
        <MainServices services={mainServices} />
      </PageLayout>
    </div>
  );
};

export default Home;