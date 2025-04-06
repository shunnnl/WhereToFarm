import { useNavigate } from "react-router";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleClickButton = (estateId) => {
    navigate(`/estate/${estateId}`);
  };

  // 숫자에 콤마 추가하는 함수
  const formatNumber = (num) => {
    // 입력값이 숫자가 아니면 그대로 반환
    if (isNaN(Number(num))) return num;

    // 숫자로 변환 후 toLocaleString 적용
    return Number(num).toLocaleString("ko-KR");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-green-800 mb-2 truncate">
          {property.address}
        </h3>
        <p className="text-sm text-gray-500">{property.type}</p>
      </div>

      <div className="grid gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">매매 금액</p>
          <p className="font-semibold">{formatNumber(property.deposit)} 만원</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">면적</p>
          <p className="font-semibold">{property.area} m²</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">매물특징</p>
        <p className="text-gray-800">{property.features}</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">{property.realtor}</span>
        <button
          className="px-3 py-1 bg-green-800 text-white text-sm rounded hover:bg-green-700"
          onClick={() => handleClickButton(property.id)}
        >
          상세보기
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
