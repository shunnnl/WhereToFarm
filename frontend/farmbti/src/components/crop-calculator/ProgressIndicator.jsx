const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className="progress-indicator-container">
      <div className="currentStep-section flex items-center justify-between mx-14 py-4">
        <div
          className={`flex items-center ${
            currentStep >= 1 ? "text-green-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span className="ml-2 font-medium">평수 입력</span>
        </div>
        <div className="flex-1 h-1 mx-2 bg-gray-200">
          <div
            className={`h-full ${currentStep >= 2 ? "bg-green-600" : "bg-gray-200"}`}
            style={{ width: currentStep >= 2 ? "100%" : "0%" }}
          ></div>
        </div>
        <div
          className={`flex items-center ${
            currentStep >= 2 ? "text-green-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span className="ml-2 font-medium">작물 선택</span>
        </div>
        <div className="flex-1 h-1 mx-2 bg-gray-200">
          <div
            className={`h-full ${currentStep >= 3 ? "bg-green-600" : "bg-gray-200"}`}
            style={{ width: currentStep >= 3 ? "100%" : "0%" }}
          ></div>
        </div>
        <div
          className={`flex items-center ${
            currentStep >= 3 ? "text-green-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? "bg-green-600 text-white" : "bg-gray-200"
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
