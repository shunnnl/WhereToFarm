const ResultSummary = ({
  cropsName,
  myAreaVolume,
  myAreaField,
  myTotalQuantity,
}) => {
  return (
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
  );
};

export default ResultSummary;
