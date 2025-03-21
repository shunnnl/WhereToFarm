import PageHeader from "../../components/common/PageHeader";
import AreaInputSection from "../../components/crop-calculator/AreaInputSection";
import ProgressIndicator from "../../components/crop-calculator/ProgressIndicator";

import { useState } from "react";

const CropCalculatorPage = () => {
  const [step, setStep] = useState(1);
  const [area, setArea] = useState(0);
  const [convertedArea, setConvertedARea] = useState(0);
  const [crop, setCrop] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoding, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAreaSubmit = () => {
    // 평을 제곱미터 변환
    setConvertedARea(area * 3.3058);
    // 변환 후 단계 넘어감
    setStep(2);
  };

  return (
    <div>
      <PageHeader
        title="작물 수익 계산기"
        description="원하는 작물 재배에 따른 예상 수익을 계산해보세요."
      />
      <div className="crop-calculator-container w-auto mx-10 bg-background">
        <ProgressIndicator currentStep={step} />
        <AreaInputSection
          area={area}
          setArea={setArea}
          convertedArea={convertedArea}
          onSubmit={handleAreaSubmit}
          isActive={step === 1}
        />
      </div>
    </div>
  );
};

export default CropCalculatorPage;
