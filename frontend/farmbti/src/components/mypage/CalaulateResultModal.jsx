import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { X } from "lucide-react";
import ResultSummary from "../crop-calculator/ResultSummary";
import AnnualBenefitResult from "../crop-calculator/AnnualBenefitResult";
import BenefitForecastGraph from "../crop-calculator/BenefitForecastGraph";

const CalculateResultModal = forwardRef(({ reportId }, ref) => {
  // reportId를 가지고 api 호출

  const [report, setReport] = useState({});
  const dialogRef = useRef(null);

  // 부모 컴포넌트에서 접근할 수 있는 메소드 노출
  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
    updateData: (data) => setReport(data),
  }));

  const handleCancel = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-5xl mx-auto p-6 rounded-xl bg-white shadow-lg overflow-hidden"
    >
      <div className="p-6 pr-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="relative">
          {/* 닫기 버튼 */}
          <button
            onClick={handleCancel}
            className="absolute right-0 top-0 text-gray-700 hover:text-gray-900"
          >
            <X size={24} />
          </button>
          {/* 타이틀 */}
          <h2 className="text-2xl font-bold text-center mb-8">
            나의 예상 수익 보고서
          </h2>

          {/* 데이터가 로드되었을 때만 컴포넌트 렌더링 */}
          {Object.keys(report).length > 0 ? (
            <>
              <ResultSummary
                cropsName={report.cropsName}
                myAreaVolume={report.myAreaVolume}
                myAreaField={report.myAreaField}
                myTotalQuantity={report.myTotalQuantity}
              />
              <AnnualBenefitResult
                myTotalPrice={report.myTotalPrice}
                myTotalOperatingPrice={report.myTotalOperatingPrice}
                myTotalRealPrice={report.myTotalRealPrice}
                myRate={report.myRate}
                isHouse={report.house}
              />
              <BenefitForecastGraph
                cropsName={report.cropsName}
                myForecast={report.myMonthlyPrice}
                pastPrice={report.myPastPrice}
                isInModal={true}
              />
            </>
          ) : (
            <div className="text-center py-10">
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default CalculateResultModal;
