import PageHeader from "../../components/common/PageHeader";
import AreaInputSection from "../../components/crop-calculator/AreaInputSection";
import CropSelectSection from "../../components/crop-calculator/CropSelectSection";
import ProgressIndicator from "../../components/crop-calculator/ProgressIndicator";

import { useEffect, useState } from "react";

import ResultSection from "../../components/crop-calculator/ResultSection";
import {
  estimateCrops,
  saveResult,
} from "../../API/crop-calculator/CropCalculatorAPI";
import { toast } from "react-toastify";

const CropCalculatorPage = () => {
  const [step, setStep] = useState(1);
  const [area, setArea] = useState(null);
  const [convertedArea, setConvertedArea] = useState(0);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [result, setResult] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 화면 렌더링 시 설정
  useEffect(() => {
    // 사용자 이름 가져오기
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userObj = JSON.parse(user);
        setUserName(userObj.name);
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error);
        setUserName("사용자");
      }
    }
  }, []);

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

    // 소숫점 두자리인지 판별
    const strNum = area.toString();
    const decimalPart = strNum.includes(".") ? strNum.split(".")[1] : "";
    if (decimalPart.length > 2) {
      setError("평수는 소수점 두 자리까지만 입력 가능합니다.");
      return;
    }
    setError(null);
    const convert = area * 3.3058;
    // 평을 제곱미터 변환
    setConvertedArea(convert.toFixed(2));
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

    // API 호출 등 후속 작업 실행
    calculateHarvest(area, selectedCrop.name);
  };

  const calculateHarvest = async (area, selectedCropName) => {
    setIsLoading(true); // 로딩 시작
    setError(null); // 에러 초기화
    try {
      // api  호출
      const data = await estimateCrops(area, selectedCropName);
      setResult(data);
    } catch (error) {
      toast.error(error.message || "알 수 없는 오류가 발생했습니다.");
      handleResetCalculate();
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const handleSaveResult = async () => {
    setIsLoading(true); // 로딩 시작
    // 저장 api
    try {
      const response = await saveResult(result.reportId);
      if (response) {
        toast.success("저장에 성공했습니다.");
        setTimeout(() => {
          window.location.href = "/mypage/crop-calculate-report";
        }, 1000);
      }
    } catch (error) {
      toast.error(error.message || "알 수 없는 오류가 발생했습니다.");
      handleResetCalculate();
    } finally {
      setIsLoading(false); // 로딩 종료
    }
    return null;
  };

  const handleResetCalculate = () => {
    setStep(1);
    setArea(null);
    setConvertedArea(0);
    setSelectedCrop(null);
    setResult(null);
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
        <ResultSection
          step={step}
          result={result}
          userName={userName}
          isLoading={isLoading}
          onSaveReport={handleSaveResult}
          onResetResult={handleResetCalculate}
        />
      </div>
    </div>
  );
};

export default CropCalculatorPage;
