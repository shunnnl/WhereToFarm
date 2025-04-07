import { useNavigate, useLocation } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickButton = (estateId) => {
    // 현재 URL의 쿼리 파라미터를 상태 객체에 저장
    const currentUrlParams = new URLSearchParams(location.search);
    const state = {
      from: location.pathname,
      search: location.search,
      page: currentUrlParams.get("page") || "1",
      province: currentUrlParams.get("province") || "",
      city: currentUrlParams.get("city") || "",
    };

    // 쿼리 파라미터를 state로 전달하면서 페이지 이동
    navigate(`/estate/${estateId}`, { state });
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
