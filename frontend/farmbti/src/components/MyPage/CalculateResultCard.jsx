const CalculateResultCard = ({ crop, area, date, totalProfit }) => {
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

  return (
    <div className="w-full max-w-md rounded-lg overflow-hidden shadow-md bg-gradient-to-br to-primaryGreen from-supportGreen">
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
            onClick={() => handleNavigate(id)}
          >
            상세
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculateResultCard;
