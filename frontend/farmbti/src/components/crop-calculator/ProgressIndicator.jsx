const ProgressIndicator = ({currentStep}) => {
  return (
    <div className="step-section w-full flex justify-between px-32 py-6">
      <div className="step-1 flex items-center">
        <div className="rounded-full bg-gray-500 text-white p-2 m-2">1</div>
        <p className="text-lg">평수 입력</p>
      </div>
      <div className="step-2 flex items-center">
        <div className="rounded-full bg-gray-500 text-white p-2 m-2">2</div>
        <p className="text-lg">작물 선택</p>
      </div>
      <div className="step-3 flex items-center">
        <div className="rounded-full bg-gray-500 text-white p-2 m-2">3</div>
        <p className="text-lg">결과 확인</p>
      </div>
    </div>
  );
};

export default ProgressIndicator;
