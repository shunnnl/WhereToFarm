import PageHeader from "../../components/common/PageHeader";
import AreaInputSection from "../../components/crop-calculator/AreaInputSection";
import CropSelectSection from "../../components/crop-calculator/CropSelectSection";
import ProgressIndicator from "../../components/crop-calculator/ProgressIndicator";

import { useState } from "react";

const CropCalculatorPage = () => {
  const [step, setStep] = useState(1);
  const [area, setArea] = useState(null);
  const [convertedArea, setConvertedARea] = useState(0);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoding, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAreaSubmit = () => {
    // 평수 입력이 없을 경우
    if (area === null || area === undefined || area === "") {
      setError("평수를 입력해주세요.");
      return;
    }
    // 숫자 타입 체크
    const areaNum = Number(area);
    if (isNaN(areaNum)) {
      setError("평수는 숫자만 입력 가능합니다.");
      return;
    }
    // 평수 범위 체크
    if (area < 100 || area > 1500) {
      setError("평수는 100평과 1500평 사이의 값을 입력해주세요.");
      return;
    }
    setError(null);
    const convert = area * 3.3058;
    // 평을 제곱미터 변환
    setConvertedARea(convert.toFixed(2));
    // 변환 후 단계 넘어감
    setStep(2);
  };

  const handleCropSubmit = () => {
    if (convertedArea != null) {
      setError("평수를 먼저 입력해주세요.");
      return;
    }
    caculateHarvest(area, convertedArea, selectedCrop);
  };

  const caculateHarvest = async (area, convertedArea, selectedCrop) => {
    setIsLoading(true); // 로딩 시작
    setError(null); // 에러 초기화
    try {
      // api  호출
      setStep(3);
    } catch (error) {
      // api 호출 실패
      // 예외 처리 로직
      setError("계산 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
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
          error={error}
        />
        <CropSelectSection
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
          onSubmit={handleCropSubmit}
          isActive={step === 2}
          isCompleted={step > 2}
          error={error}
        />
      </div>
    </div>
  );
};

export default CropCalculatorPage;
