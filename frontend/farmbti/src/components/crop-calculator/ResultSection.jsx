import LoadingSpinner from "../common/LoadingSpinner";
import AnnualBenefitResult from "./AnnualBenefitResult";
import BenefitForecastGraph from "./BenefitForecastGraph";

import ResultSummary from "./ResultSummary";

const ResultSection = ({
  step,
  result,
  isLoading,
  onSaveReport,
  onResetResult,
}) => {
  return (
    <div>
      {step === 1 && (
        <div className="bg-accentGreen-light min-h-screen mx-5 flex flex-col items-center justify-center">
          <p className="text-lg text-supportGreen font-semibold">
            평수를 입력하고 작물을 선택해 예상 수익을 계산해보세요.
          </p>
        </div>
      )}
      {step === 2 && (
        <div className="bg-accentGreen-light min-h-screen mx-5 flex flex-col items-center justify-center">
          <p className="text-lg text-supportGreen font-semibold">
            작물을 선택해 예상 수익을 계산해보세요.
          </p>
        </div>
      )}
      {isLoading && step === 3 && (
        <div className="bg-accentGreen-light min-h-screen mx-5 flex flex-col items-center justify-center">
          <LoadingSpinner text="계산 중..." />
        </div>
      )}
      {!isLoading && result && step === 3 && (
        <div className="bg-accentGreen-light mx-5 flex flex-col items-center justify-center">
          <div className="m-5 bg-white w-full shadow-md">
            <div className="report-name mx-14 my-8">
              <span className="text-3xl pr-2">📜 </span>
              <span className="text-3xl font-bold text-supportGreen">
                {result.usersName}{" "}
              </span>
              <span className="text-xl font-semibold text-textColor-black mr-3">
                님의{" "}
              </span>
              <span className="text-3xl font-semibold text-textColor-black ">
                예상 수익 보고서
              </span>
            </div>
            <ResultSummary
              cropsName={result.cropsName}
              myAreaVolume={result.myAreaVolume}
              myAreaField={result.myAreaField}
              myTotalQuantity={result.myTotalQuantity}
            />
            <AnnualBenefitResult
              myTotalPrice={result.myTotalPrice}
              myTotalOperatingPrice={result.myTotalOperatingPrice}
              myTotalRealPrice={result.myTotalRealPrice}
              myRate={result.myRate}
              isHouse={result.house}
            />
            <BenefitForecastGraph
              cropsName={result.cropsName}
              myForecast={result.myMonthlyPrice}
              pastPrice={result.myPastPrice}
            />
            <div className="flex justify-center items-center gap-4 mb-6">
              <button
                className="bg-primaryGreen hover:bg-green-600 px-4 py-2 text-sm text-white font-light rounded-md shadow-lg transition-colors duration-200"
                onClick={onSaveReport}
              >
                수익 계산 보고서 저장하기
              </button>
              <button
                className="bg-textColor-lightgray hover:bg-gray-300 px-4 py-2 text-sm text-white font-light rounded-md shadow-lg transition-colors duration-200"
                onClick={onResetResult}
              >
                다시 계산하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultSection;
