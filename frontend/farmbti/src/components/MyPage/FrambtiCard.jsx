import { useNavigate } from "react-router";

const FarmbtiCard = ({ id, reportName, farmerType, date, matchRate }) => {
  const formattedDate = new Date(date)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ". ")
    .replace(/\.$/, "");

  const progressWidth = `${matchRate}%`;

  const handleNavigate = (reportId) => {
    useNavigate(`/report/${reportId}`)
  };
  return (
    <div className="w-full max-w-md rounded-lg overflow-hidden shadow-md bg-gradient-to-br to-primaryGreen from-supportGreen">
      <div className="px-6 py-2 text-white flex justify-between items-center">
      <div className="font-medium text-sm">귀농 유형</div>
      <div className="text-md">{farmerType}</div>
      </div>

      <div className="bg-white px-6 py-4 rounded-t-lg">
        <h2 className="font-bold text-lg">{reportName}</h2>

        <div className="text-sm text-gray-500 mb-2">
          테스트 일지 {formattedDate}
        </div>
        <div className="mb-2">
          <div className="text-sm text-gray-600 mb-1">지역 적합도</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-br to-primaryGreen from-supportGreen h-2 rounded-full"
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">{matchRate}%</div>

        <button
          className="bg-primaryGreen text-white px-4 py-1 rounded-md text-sm"
          onClick={() => handleNavigate(id)} 
        >
          상세
        </button>
      </div>
    </div>
  );
};

export default FarmbtiCard;
