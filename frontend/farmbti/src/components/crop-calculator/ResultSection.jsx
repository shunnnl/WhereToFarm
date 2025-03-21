const ResultSection = ({ step, result, isLoading }) => {
  return (
    <div className="bg-accentGreen-light h-96 mx-5 flex felx-col items-center justify-center">
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
        <div className="m-5 bg-white shadow-md">
          <h1>00님의 작물 수확 예상 계산 결과</h1>
        </div>
      )}
    </div>
  );
};

export default ResultSection;
