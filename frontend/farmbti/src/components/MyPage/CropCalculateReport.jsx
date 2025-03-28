import { useEffect, useState } from "react";
import CalculateResultCard from "./CalculateResultCard";
import PaginationComponent from "../common/Pagination";
import { getCalculateReports } from "../../API/mypage/MyPageAPI";
import { toast } from "react-toastify";
import { Link } from "react-router";

const CropCalculateReport = () => {
  // 예시 데이터
  const [myCalculateResult, setMyCalculateResult] = useState([]);

  useEffect(() => {
    const getReports = async () => {
      try {
        const data = await getCalculateReports();
        setMyCalculateResult(data);
      } catch (error) {
        // console.log(error);
        toast.error(error.message || "정보를 불러올 수 없습니다.");
      }
    };
    getReports();
  }, []);

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

  return (
    <div className="relative pb-20">
      <div className="flex justify-between items-center mt-4 mb-2">
        <p className="text-xl font-semibold">나의 작물 계산 리포트</p>
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
        {myCalculateResult.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentItems.map((report) => (
              <CalculateResultCard
                key={report.reportId}
                id={report.reportId}
                crop={report.cropsName}
                area={report.myAreaVolume}
                date={report.createdAt}
                totalProfit={report.myTotalPrice}
                deleteMode={deleteMode}
                onDelete={handleDeleteReport}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center p-48">
            <p className="text-center text-lg text-textColor-gray font-medium">
              계산 리포트가 없습니다.
            </p>
            <Link
              to={"/crop-calculator"}
              className="text-center text-md text-primaryGreen hover:underline"
            >
              작물 수확 계산 하러 가기
            </Link>
          </div>
        )}
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
