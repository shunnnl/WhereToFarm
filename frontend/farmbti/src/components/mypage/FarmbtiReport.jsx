import { useState, useEffect } from "react";
import FarmbtiCard from "./FrambtiCard";
import PaginationComponent from "../common/Pagination";

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
    {
      id: 3,
      reportName: "소태미 마을 외 2",
      farmerType: "자연친화형 농부",
      date: "2024-02-13",
      matchRate: 60,
    },
    {
      id: 4,
      reportName: "소태미 마을 외 2",
      farmerType: "자연친화형 농부",
      date: "2024-02-13",
      matchRate: 60,
    },
    {
      id: 5,
      reportName: "소태미 마을 외 2",
      farmerType: "자연친화형 농부",
      date: "2024-02-13",
      matchRate: 60,
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
  const currentItems = myFarmbtiReports.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // 삭제 모드 토글 상태
  const [deleteMode, setDeleteMode] = useState(false);

  // 삭제 모드 토글 핸들러
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  // 리포트 삭제 핸들러
  const handleDeleteReport = (reportId) => {
    setMyFarmbtiReports((prevReports) =>
      prevReports.filter((report) => report.id !== reportId)
    );
  };

  // 화면이 랜더링 되면서 api 요청
  useEffect(() => {}, []);

  return (
    <div className="relative pb-20">
      <div className="flex justify-between items-center mt-4 mb-2">
        <p className="text-xl font-semibold">나의 귀농 리포트 톡톡</p>
        <button
          onClick={toggleDeleteMode}
          className={`px-3 py-1 rounded-md text-sm ${
            deleteMode ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {deleteMode ? "삭제 취소" : "삭제하기"}
        </button>
      </div>
      <p className="text-sm font-light text-primaryGreen mb-4">
        *모든 리포트는 최신순으로 정렬되어 있습니다.
      </p>

      <div className="h-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentItems.map((report) => {
            return (
              <FarmbtiCard
                key={report.id}
                id={report.id}
                reportName={report.reportName}
                farmerType={report.farmerType}
                date={report.date}
                matchRate={report.matchRate}
                deleteMode={deleteMode}
                onDelete={handleDeleteReport}
              />
            );
          })}
        </div>
      </div>

      {/* 페이지네이션 - 절대 위치로 고정 */}
      {myFarmbtiReports.length > itemsPerPage && (
        <div
          className="absolute bottom-0 left-0 w-full flex justify-center"
          style={{ marginBottom: "20px" }}
        >
          <PaginationComponent
            activePage={activePage}
            totalItemsCount={myFarmbtiReports.length}
            onChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default FarmbtiReport;
