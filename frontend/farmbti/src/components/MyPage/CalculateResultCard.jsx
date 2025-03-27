import { useRef } from "react";
import CalculateResultModal from "./CalaulateResultModal";

const CalculateResultCard = ({
  id,
  crop,
  area,
  date,
  totalProfit,
  deleteMode,
  onDelete,
}) => {
  const formattedDate = new Date(date)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ". ")
    .replace(/\.$/, "");

  const totalProfitWon = totalProfit.toLocaleString("ko-KR", {
    maximumFractionDigits: 0,
  });

  const modalRef = useRef(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onDelete(id);
  };

  return (
    <div className="w-full max-w-md rounded-lg overflow-hidden shadow-md bg-gradient-to-br to-primaryGreen from-supportGreen">
      {deleteMode && (
        <button
          className="absolute top-12 right-4 z-10 text-red-500 w-6 h-6 flex items-center justify-center"
          onClick={handleDelete}
        >
          <Trash2 />
        </button>
      )}

      <div className="px-6 py-2 text-white flex justify-between items-center">
        <div className="font-medium text-sm">작물 종류</div>
        <div className="text-md">{crop}</div>
      </div>

      <div className="bg-white p-6 rounded-t-lg">
        <h2 className="font-bold text-lg mb-1">토지 면적: {area} 평</h2>

        <div className="text-sm text-gray-500 mb-4">
          계산 일자 {formattedDate}
        </div>

        <div className="flex justify-between">
          <div className="text-sm text-gray-500 mb-4">
            총 수익 : {totalProfitWon} 원
          </div>
          <button
            className="bg-primaryGreen text-white px-4 py-1 rounded-md text-sm"
            onClick={openModal}
          >
            상세
          </button>
        </div>
      </div>

      <CalculateResultModal ref={modalRef} reportId={id} />
    </div>
  );
};

export default CalculateResultCard;
