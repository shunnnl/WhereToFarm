import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";

const FarmbtiCard = ({
  id,
  reportName,
  farmerType,
  date,
  matchRate,
  deleteMode,
  onDelete,
}) => {
  const navigate = useNavigate();
  const formattedDate = new Date(date)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ". ")
    .replace(/\.$/, "");

  const handleNavigate = (reportId) => {
    navigate(`/report/${reportId}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onDelete(id);
  };

  return (
    <div className="w-full max-w-md rounded-lg overflow-hidden shadow-md bg-gradient-to-br to-primaryGreen from-supportGreen relative">
      {deleteMode && (
        <button
          className="absolute top-12 right-4 z-10 text-red-500 w-6 h-6 flex items-center justify-center"
          onClick={handleDelete}
        >
          <Trash2 />
        </button>
      )}

      <div className="px-6 py-2 text-white flex justify-between items-center">
        <div className="font-medium text-sm">귀농 유형</div>
        <div className="text-md">{farmerType}</div>
      </div>

      <div className="bg-white px-6 py-4 rounded-t-lg flex flex-col">
        <h2 className="font-bold text-lg">{reportName} 외 2</h2>

        <div className="text-sm text-gray-500 mb-4">
          테스트 일지 {formattedDate}
        </div>

        <div className="flex flex-col items-end">
          <button
            className="bg-primaryGreen text-white px-4 py-1 rounded-md text-sm w-20"
            onClick={() => handleNavigate(id)}
          >
            상세
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmbtiCard;
