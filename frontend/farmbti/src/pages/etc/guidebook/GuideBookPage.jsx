import React, { useEffect } from "react";
import GuideStep from "../../../components/guidebook/GuideStep";
import GuideIntro from "../../../components/guidebook/GuideIntro";
import PageHeader from "../../../components/common/PageHeader";

// 이미지 import
import guide1 from "../../../asset/guidebook/guide1.png";
import guide2 from "../../../asset/guidebook/guide2.png";
import guide3 from "../../../asset/guidebook/guide3.png";
import guide4 from "../../../asset/guidebook/guide4.png";
import guide5 from "../../../asset/guidebook/guide5.png";
import introImage from "../../../asset/guidebook/intro.png";

const GuideBookPage = () => {
  const steps = [
    {
      number: 1,
      title: "귀농 정보를 수집하자!",
      description:
        "귀농지원센터(사업 안내등, www.greenidea.go.kr), 농업관측 관련 기관 (시군 농업기술센터, 지능기반시설센터 등) 방문 또는 전화 문의나 자료 등을 통해 필요한 정보를 수집하고, 귀농 귀촌박람회 기회 교육자료를 참여하여 정보를 얻습니다.",
      imageSrc: guide1,
    },
    {
      number: 2,
      title: "어떤 작물을 기를까?",
      description:
        "귀농 교육 제반 프로그램에 참여하여, 자신의 여건과 적성, 기술수준, 자본능력 등에 적합한 작물을 선정하게 됩니다.",
      imageSrc: guide2,
    },
    {
      number: 3,
      title: "어디서 정착할까?",
      description:
        "자녀교육 등 생활 여건과 선정한 작물에 적합한 입지 조건, 농업여건 등을 종합적으로 검토하고 결정합니다.",
      imageSrc: guide3,
    },
    {
      number: 4,
      title: "주택과 농지를 확인하자!",
      description:
        "주택과 귀농에 필요한 농지 매매를 결정하기 전 최소 3~4곳을 비교 후 선택합니다.",
      imageSrc: guide4,
    },
    {
      number: 5,
      title: "영농계획을 수립하자!",
      description:
        "농산물을 생산하여 수익이 생길 때까지 필수 4~5년 정도 생활비와 정착 자금이 필요하므로 자금 계획을 세우고, 영농계획을 수립합니다.",
      imageSrc: guide5,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <PageHeader title="가이드" description="귀농 절차에 대해 알려드립니다." />

      <GuideIntro
        description="귀농 준비시 나의 단계가 어떤 단계인지 판단해 보실 수 있으며, 각 단계에서 어떤 사항을 고려해야 하는지를 알아보실 수 있습니다."
        imageSrc={introImage}
      />

      {steps.map((step) => (
        <GuideStep
          key={step.number}
          stepNumber={step.number}
          title={step.title}
          description={step.description}
          imageSrc={step.imageSrc}
        />
      ))}
    </div>
  );
};

export default GuideBookPage;
