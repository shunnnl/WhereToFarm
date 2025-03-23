import AnnualBenefitResult from "./AnnualBenefitResult";

import ResultSummary from "./ResultSummary";

const ResultSection = ({ step, result, userName, isLoading }) => {
  return (
    <div className="bg-accentGreen-light min-h-screen mx-5 flex felx-col items-center justify-center">
      {step === 1 && (
        <p className="text-lg text-supportGreen font-semibold">
          평수를 입력하고 작물을 선택해 예상 수익을 계산해보세요.
        </p>
      )}
      {step === 2 && (
        <p className="text-lg text-supportGreen font-semibold">
          작물을 선택해 예상 수익을 계산해보세요.
        </p>
      )}
      {!isLoading && result && step === 3 && (
        <div className="m-5 bg-white w-full h-full shadow-md">
          <div className="report-name mx-14 my-8">
            <span className="text-3xl pr-2">📜 {" "}</span>
            <span className="text-3xl font-bold text-supportGreen">
              {userName}{" "}
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
        </div>
      )}
    </div>
  );
};

export default ResultSection;
