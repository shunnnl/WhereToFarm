import PageHeader from "../../components/common/PageHeader";
import InputSection from "../../components/crop-calculator/InputSection";
import StepSection from "../../components/crop-calculator/StepSection";

const CropCalculatorPage = () => {
  return (
    <div>
      <PageHeader
        title="작물 수익 계산기"
        description="원하는 작물 재배에 따른 예상 수익을 계산해보세요."
      />
      <div className="crop-calculator-container w-full bg-gray-100">
        <StepSection/>
        <InputSection/>
      </div>
    </div>
  );
};

export default CropCalculatorPage;
