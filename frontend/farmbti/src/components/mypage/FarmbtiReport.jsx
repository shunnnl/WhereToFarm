import { useState, useEffect } from "react";
import FarmbtiCard from "./FrambtiCard";
import PaginationComponent from "../common/Pagination";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import {
  getMyFarmbtiReports,
  deleteMyFarmbtiReport,
} from "../../API/mypage/MyReportsAPI";
import { toast } from "react-toastify";
import { Link } from "react-router";

const FarmbtiReport = () => {
  const [myFarmbtiReports, setMyFarmbtiReports] = useState([]);

  useEffect(() => {
    const getReports = async () => {
      try {
        const data = await getMyFarmbtiReports();
        setMyFarmbtiReports(data);
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
  const currentItems = myFarmbtiReports.slice(
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
    console.log("===삭제할 리포트:", report);
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
      // Path parameter로 직접 reportId 전달
      const response = await deleteMyFarmbtiReport(reportToDelete.reportId);

      if (response.success) {
        setMyFarmbtiReports((prevReports) =>
          prevReports.filter(
            (report) => report.reportId !== reportToDelete.reportId
          )
        );
        toast.success("리포트가 삭제되었습니다.");
        closeModal();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "리포트 삭제에 실패했습니다.");
    }
  };

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
        {myFarmbtiReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentItems.map((report) => (
              <FarmbtiCard
                key={report.reportId}
                id={report.reportId}
                reportName={report.topRegionName}
                farmerType={report.characterTypeName}
                date={report.createdAt}
                deleteMode={deleteMode}
                onDelete={() => prepareDeleteReport(report)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center p-48">
            <p className="text-center text-lg text-textColor-gray font-medium">
              귀농 리포트가 없습니다.
            </p>
            <Link
              to={"/surveyintro"}
              className="text-center text-md text-primaryGreen hover:underline"
            >
              귀농 적성 테스트 하러 가기
            </Link>
          </div>
        )}
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

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDeleteReport}
        title="리포트 삭제"
        message="삭제하시겠습니까?"
        itemName={reportToDelete?.topRegionName}
      />
    </div>
  );
};

export default FarmbtiReport;
