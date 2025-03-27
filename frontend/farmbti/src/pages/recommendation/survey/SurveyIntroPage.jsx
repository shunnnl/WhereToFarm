import React from 'react';
import { useNavigate } from 'react-router-dom';
import surveyIntroImg from '../../../asset/recommendation/survey/surveyintro.png';

const SurveyIntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[750px] bg-gradient-to-b from-white to-[#FFF9E2] flex items-center">
      <div className="w-full max-w-[1200px] mx-auto px-20 flex items-center">
        {/* 왼쪽: 이미지 */}
        <div className="w-[400px] mr-20">
          <img 
            src={surveyIntroImg}
            alt="농부 캐릭터" 
            className="w-full h-auto"
          />
        </div>

        {/* 오른쪽: 텍스트 컨텐츠 */}
        <div className="flex flex-col items-start -ml-10">
          {/* 로고 */}
          <div className="mb-8">
            <span className="text-[#B69B7D] text-6xl font-bold">FARM</span>
            <span className="text-black text-6xl font-bold">bti</span>
          </div>

          {/* 제목 */}
          <h1 className="text-6xl font-bold mb-12">테스트</h1>

          {/* 설명 텍스트 */}
          <div className="space-y-4 mb-12">
            <p className="text-2xl">나는 어떤 유형의 농부일까?</p>
            <p className="text-2xl">내 성향에 맞는 귀농 지역이 궁금하다면?</p>
            <p className="text-2xl">16가지 유형으로 보는 나만의 귀농 성향 테스트!</p>
          </div>

          {/* 시작하기 버튼 */}
          <button
            onClick={() => navigate('/survey')}
            className="bg-[#1B4B36] text-white px-12 py-4 rounded-full text-xl hover:bg-[#143728] transition-colors"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyIntroPage; 