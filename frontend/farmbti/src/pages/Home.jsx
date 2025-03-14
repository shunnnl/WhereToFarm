import React from 'react';
import homeimage_1 from "../asset/home/home_image_1.svg";
import FullWidthSection from '../components/layout/FullWidthSection';
import PageLayout from '../components/layout/PageLayout';


const Home = () => {
  return (
    <div className="w-full">
      {/* 배너 이미지 섹션 */}
      <FullWidthSection>
        <img
          src={homeimage_1}
          alt="Home Banner Image"
          className="w-full h-full object-cover object-center"
        />
      </FullWidthSection>


      <PageLayout>
        컨텐츠들..

      </PageLayout>
      

    </div>
  );
};

export default Home;