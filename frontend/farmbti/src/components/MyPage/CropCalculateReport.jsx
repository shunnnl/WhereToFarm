import { useState } from "react";
import CalculateResultCard from "./CalculateResultCard";

const CropCalculateReport = () => {
  const [myCalculateResult, setMyCalculateResult] = useState([
    {
      id: 1,
      crop: "고구마",
      area: 900,
      date: "2024-01-19",
      totalProfit: 8500000000,
    },
  ])
  return (
    <div>
      <p className="text-xl font-semibold mt-4">작물 예상 계산 리포트</p>
      <p className="text-sm font-light text-primaryGreen mb-4">
        *모든 리포트는 최신순으로 정렬되어 있습니다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myCalculateResult.map((report) => {
          return (
            <CalculateResultCard
              key={report.id}
              id={report.id}
              crop={report.crop}
              area={report.area}
              date={report.date}
              totalProfit={report.totalProfit}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CropCalculateReport;
