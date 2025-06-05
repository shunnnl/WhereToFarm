import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import FarmbtiCard from "./FrambtiCard";
import PaginationComponent from "../common/Pagination";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  getMyFarmbtiReports,
  deleteMyFarmbtiReport,
} from "../../API/mypage/MyReportsAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { handleError } from "../../utils/ErrorUtil";

const FarmbtiReport = () => {
  const [myFarmbtiReports, setMyFarmbtiReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL 쿼리 파라미터 관리를 위한 훅
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // URL에서 페이지 번호를 가져오는 함수
  const getPageFromUrl = () => {
    const page = searchParams.get("page");
    return page ? parseInt(page) : 1;
  };

  // 페이지네이션 상태 - URL에서 초기값 가져오기
  const [activePage, setActivePage] = useState(getPageFromUrl());
  const itemsPerPage = 4; // 2x2 그리드에 맞는 4개 항목

  // URL 쿼리 파라미터가 변경될 때 페이지 상태 업데이트
  useEffect(() => {
    setActivePage(getPageFromUrl());
  }, [location.search]);

  // 페이지 변경 핸들러 - URL 쿼리 파라미터 업데이트
  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  useEffect(() => {
    const getReports = async () => {
      setIsLoading(true);
      try {
        const data = await getMyFarmbtiReports();
        setMyFarmbtiReports(data);
      } catch (error) {
        handleError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getReports();
  }, []);

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

        // 현재 페이지에 아이템이 없어지면 이전 페이지로 이동
        const remainingItems = myFarmbtiReports.length - 1;
        const maxPage = Math.ceil(remainingItems / itemsPerPage);
        if (activePage > maxPage && maxPage > 0) {
          handlePageChange(maxPage);
        }
      }
    } catch (error) {
      handleError(error);
      console.error(error);
    }
  };

  return (
    <div className="relative pb-20">
      <div className="flex justify-between items-center mt-4 mb-2">
        <p className="text-xl font-semibold">나의 귀농 리포트 톡톡</p>
        {/* 로딩 중이 아니고 리포트가 있을 때만 삭제 버튼 표시 */}
        {!isLoading && myFarmbtiReports.length > 0 && (
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
            <LoadingSpinner text="리포트를 불러오는 중..." />
          </div>
        ) : myFarmbtiReports.length > 0 ? (
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
      {!isLoading && myFarmbtiReports.length > itemsPerPage && (
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
