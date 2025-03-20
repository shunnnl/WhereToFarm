const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className="progress-indicator-container">
      <div className="currentStep-section flex items-center justify-between mx-14 y-4">
        <div
          className={`flex items-center ${
            currentStep >= 1 ? "text-supportGreen" : "text-textColor-darkgray"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-supportGreen text-white" : "bg-textColor-lightgray"
            }`}
          >
            1
          </div>
          <span className="ml-2 font-medium">평수 입력</span>
        </div>
        <div className="flex-1 h-1 mx-2 bg-textColor-lightgray">
          <div
            className={`h-full ${currentStep >= 2 ? "bg-supportGreen" : "bg-textColor-lightgray"}`}
            style={{ width: currentStep >= 2 ? "100%" : "0%" }}
          ></div>
        </div>
        <div
          className={`flex items-center ${
            currentStep >= 2 ? "text-supportGreen" : "text-textColor-darkgray"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-supportGreen text-white" : "bg-textColor-lightgray"
            }`}
          >
            2
          </div>
          <span className="ml-2 font-medium">작물 선택</span>
        </div>
        <div className="flex-1 h-1 mx-2 bg-textColor-lightgray">
          <div
            className={`h-full ${currentStep >= 3 ? "bg-supportGreen" : "bg-textColor-lightgray"}`}
            style={{ width: currentStep >= 3 ? "100%" : "0%" }}
          ></div>
        </div>
        <div
          className={`flex items-center ${
            currentStep >= 3 ? "text-supportGreen" : "text-textColor-darkgray"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? "bg-supportGreen text-white" : "bg-textColor-lightgray"
            }`}
          >
            3
          </div>
          <span className="ml-2 font-medium">결과 확인</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
