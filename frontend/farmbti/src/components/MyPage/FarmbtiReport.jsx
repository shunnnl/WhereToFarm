import { useState, useEffect } from "react";
import FarmbtiCard from "./FrambtiCard";

const FarmbtiReport = () => {
  const [myFarmbtiReports, setMyFarmbtiReports] = useState([
    {
      id: 1,
      reportName: "산천리 마을 외 2",
      farmerType: "흥미진진형 농부",
      date: "2024-01-19",
      matchRate: 85,
    },
    {
      id: 2,
      reportName: "소태미 마을 외 2",
      farmerType: "자연친화형 농부",
      date: "2024-02-13",
      matchRate: 60,
    },
  ]);

  // 화면이 랜더링 되면서 api 요청
  useEffect(() => {}, []);

  return (
    <div>
      <p className="text-xl font-semibold mt-4">나의 귀농 리포트 톡톡</p>
      <p className="text-sm font-light text-primaryGreen mb-4">
        *모든 리포트는 최신순으로 정렬되어 있습니다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myFarmbtiReports.map((report) => {
          return (
            <FarmbtiCard
              key={report.id}
              id={report.id}
              reportName={report.reportName}
              farmerType={report.farmerType}
              date={report.date}
              matchRate={report.matchRate}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FarmbtiReport;
