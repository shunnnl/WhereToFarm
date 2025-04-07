import { useEffect, useState } from "react";
import CalculateResultCard from "./CalculateResultCard";
import PaginationComponent from "../common/Pagination";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  deleteCropsReports,
  getCalculateReports,
} from "../../API/mypage/MyReportsAPI";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { handleError } from "../../utils/ErrorUtil";

const CropCalculateReport = () => {
  // 예시 데이터
  const [myCalculateResult, setMyCalculateResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const getReports = async () => {
      setIsLoading(true); // 데이터 로딩 시작
      try {
        const data = await getCalculateReports();
        setMyCalculateResult(data);
      } catch (error) {
        handleError(error);
        console.error(error);
      } finally {
        setIsLoading(false); // 데이터 로딩 완료
      }
    };
    getReports();
  }, []);

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 4;

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

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  // 삭제 모드 토글 핸들러
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  // 리포트 삭제 준비 핸들러
  const prepareDeleteReport = (report) => {
    setReportToDelete(report);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false);
    setReportToDelete(null);
  };

  // 리포트 삭제 핸들러
  const confirmDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      const response = await deleteCropsReports(reportToDelete.reportId);

      if (response.success) {
        setMyCalculateResult((prevReports) =>
          prevReports.filter(
            (report) => report.reportId !== reportToDelete.reportId
          )
        );
        toast.success("리포트가 삭제되었습니다.");
        closeModal();
      }
    } catch (error) {
      handleError(error);
      console.error(error);
    }
  };

  return (
    <div className="relative pb-20">
      <div className="flex justify-between items-center mt-4 mb-2">
        <p className="text-xl font-semibold">나의 작물 계산 리포트</p>
        {/* 로딩 중이 아니고 데이터가 있을 때만 삭제 버튼 표시 */}
        {!isLoading && myCalculateResult.length > 0 && (
          <button
            onClick={toggleDeleteMode}
            className={`px-3 py-1 rounded-md text-sm ${
              deleteMode ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {deleteMode ? "삭제 취소" : "삭제하기"}
          </button>
        )}
      </div>
      <p className="text-sm font-light text-primaryGreen mb-4">
        *모든 리포트는 최신순으로 정렬되어 있습니다.
      </p>

      <div className="h-auto">
        {/* 로딩 상태 표시 */}
        {isLoading ? (
          <div className="flex justify-center items-center p-24">
            <LoadingSpinner text="리포트 불러오는 중..."/>
          </div>
        ) : myCalculateResult.length > 0 ? (
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
                onDelete={() => prepareDeleteReport(report)}
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
      {!isLoading && myCalculateResult.length > itemsPerPage && (
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

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDeleteReport}
        title="리포트 삭제"
        message="삭제하시겠습니까?"
        itemName={reportToDelete?.cropsName}
      />
    </div>
  );
};

export default CropCalculateReport;
