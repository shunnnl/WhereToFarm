import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { X } from "lucide-react";
import ResultSummary from "../crop-calculator/ResultSummary";
import AnnualBenefitResult from "../crop-calculator/AnnualBenefitResult";
import BenefitForecastGraph from "../crop-calculator/BenefitForecastGraph";

const CalculateResultModal = forwardRef(({ reportId }, ref) => {
  // reportId를 가지고 api 호출

  const [report, setReport] = useState({
    id: 1,
    cropsName: "고구마",
    myAreaVolume: 100,
    myAreaField: 330.58,
    myTotalQuantity: 599.01096,
    myTotalPrice: 1358222.31032,
    myTotalOperatingPrice: 668901.19186,
    myTotalRealPrice: 689321.1184599999,
    myRate: 50.8,
    house: false,
    myMonthlyPrice: {
      monthly_data: [
        {
          date: "2025-01-01",
          price_forecast: 2024.573974609375,
          year: 2025,
          month: 1,
        },
        {
          date: "2025-02-01",
          price_forecast: 2052.865478515625,
          year: 2025,
          month: 2,
        },
        {
          date: "2025-03-01",
          price_forecast: 2039.0390625,
          year: 2025,
          month: 3,
        },
        {
          date: "2025-04-01",
          price_forecast: 2261.031982421875,
          year: 2025,
          month: 4,
        },
        {
          date: "2025-05-01",
          price_forecast: 2295.0732421875,
          year: 2025,
          month: 5,
        },
        {
          date: "2025-06-01",
          price_forecast: 2334.068115234375,
          year: 2025,
          month: 6,
        },
        {
          date: "2025-07-01",
          price_forecast: 2397.01904296875,
          year: 2025,
          month: 7,
        },
        {
          date: "2025-08-01",
          price_forecast: 2145.0546875,
          year: 2025,
          month: 8,
        },
        {
          date: "2025-09-01",
          price_forecast: 1960.308349609375,
          year: 2025,
          month: 9,
        },
        {
          date: "2025-10-01",
          price_forecast: 2210.23828125,
          year: 2025,
          month: 10,
        },
        {
          date: "2025-11-01",
          price_forecast: 2260.0625,
          year: 2025,
          month: 11,
        },
        {
          date: "2025-12-01",
          price_forecast: 2268.335205078125,
          year: 2025,
          month: 12,
        },
      ],
    },
  });
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
          {/* 내용 */}
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
          <BenefitForecastGraph myForecast={report.myMonthlyPrice} />
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
