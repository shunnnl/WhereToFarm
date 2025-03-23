import AnnualBenefitResult from "./AnnualBenefitResult";

import { useState } from "react";

const ResultSection = ({ step, result, userName, isLoading }) => {
  const [cropsName, setCropName] = useState(result.cropsName);
  const [myAreaVolume, setMyAreaVolume] = useState(result.myAreaVolume);
  const [myAreaField, setMyAreaField] = useState(result.myAreaField);
  const [myTotalQuantity, setMyTotalQuantity] = useState(
    result.myTotalQuantity
  );
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
          <div className="report-name mx-6 my-8">
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
          <div className="report-summary bg-accentGreen-light rounded-lg shadow-sm m-4 p-4">
            <div>
              <span className="text-xl font-medium text-textColor-black">
                선택하신 작물은{" "}
              </span>
              <span className="text-2xl font-bold text-primaryGreen">
                {cropsName}{" "}
              </span>
              <span className="text-xl font-medium text-textColor-black">
                입니다.
              </span>
            </div>
            <div>
              <span className="text-xl font-medium text-textColor-black">
                입력하신 재배 면적은{" "}
              </span>
              <span className="text-2xl font-bold text-primaryGreen">
                {" "}
                {myAreaVolume} 평 ({myAreaField.toFixed(2)} ㎡)
              </span>
              <span className="text-xl font-medium text-textColor-black">
                {" "}
                입니다.
              </span>
            </div>
            <div>
              <span className="text-xl font-medium text-textColor-black">
                1년 1기작 기준
              </span>
              <span className="text-2xl font-bold text-primaryGreen">
                {" "}
                {myTotalQuantity.toFixed(2)} Kg
              </span>
              <span className="text-xl font-medium text-textColor-black">
                {" "}
                수확을 할 수 있을 것으로 예상됩니다.
              </span>
            </div>
          </div>
          <AnnualBenefitResult
            myTotalPrice={result.myTotalPrice}
            myTotalOperatingPrice={result.myTotalOperatingPrice}
            mymyTotalRealPrice={result.myTotalRealPrice}
            myRate={result.myRate}
            isHouse={result.house}
          />
        </div>
      )}
    </div>
  );
};

export default ResultSection;
