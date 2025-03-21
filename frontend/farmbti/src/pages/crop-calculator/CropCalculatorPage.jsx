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
    // 작물이 선택되지 않았을 경우
    if (!selectedCrop) {
      setError("작물을 선택해주세요.");
      return;
    }
    // 평수가 입력되지 않았을 경우
    if (convertedArea === 0) {
      setError("평수를 먼저 입력해주세요.");
      setStep(1); // 첫 단계로 돌아가기
      return;
    }

    // 이미 3단계인 경우 중복 호출 방지
    if (step === 3) {
      return;
    }

    setError(null);
    setStep(3);
    console.log("Step changed to 3, selectedCrop:", selectedCrop.name);

    // API 호출 등 후속 작업 실행
    calculateHarvest(area, convertedArea, selectedCrop);
  };

  const calculateHarvest = async (area, convertedArea, selectedCrop) => {
    setIsLoading(true); // 로딩 시작
    setError(null); // 에러 초기화
    try {
      // api  호출
      console.log("API 호출 시작", { area, convertedArea, crop: selectedCrop });

      // 임시 딜레이 (실제 API 호출로 대체)
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
