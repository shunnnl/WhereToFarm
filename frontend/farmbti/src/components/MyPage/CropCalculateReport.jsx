import { useState } from "react";
import CalculateResultCard from "./CalculateResultCard";
import PaginationComponent from "../common/Pagination";

const CropCalculateReport = () => {
  // 예시 데이터
  const [myCalculateResult, setMyCalculateResult] = useState([
    {
      id: 1,
      crop: "고구마",
      area: 900,
      date: "2024-01-19",
      totalProfit: 8500000000,
    },
    {
      id: 2,
      crop: "감자",
      area: 750,
      date: "2024-01-18",
      totalProfit: 6200000000,
    },
    {
      id: 3,
      crop: "양파",
      area: 500,
      date: "2024-01-17",
      totalProfit: 4700000000,
    },
    {
      id: 4,
      crop: "당근",
      area: 600,
      date: "2024-01-16",
      totalProfit: 5100000000,
    },
    {
      id: 5,
      crop: "마늘",
      area: 450,
      date: "2024-01-15",
      totalProfit: 9200000000,
    },
  ]);

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 4; // 2x2 그리드에 맞는 4개 항목

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  // 현재 페이지에 표시할 아이템 계산
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myCalculateResult.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="relative pb-20">
      <p className="text-xl font-semibold mt-4">작물 예상 계산 리포트</p>
      <p className="text-sm font-light text-primaryGreen mb-4">
        *모든 리포트는 최신순으로 정렬되어 있습니다.
      </p>

      <div className="h-auto">
        {/* 현재 페이지의 아이템만 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentItems.map((report) => (
            <CalculateResultCard
              key={report.id}
              id={report.id}
              crop={report.crop}
              area={report.area}
              date={report.date}
              totalProfit={report.totalProfit}
            />
          ))}
        </div>
      </div>

      {/* 페이지네이션 - 절대 위치로 고정 */}
      {myCalculateResult.length > itemsPerPage && (
        <div
          className="absolute bottom-0 left-0 w-full flex justify-center"
          style={{ marginBottom: "20px" }}
        >
          <PaginationComponent
            activePage={activePage}
            totalItemsCount={myCalculateResult.length}
            onChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default CropCalculateReport;
