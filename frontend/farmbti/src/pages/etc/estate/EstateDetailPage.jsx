import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";

// 가상의 API 호출 함수 - 실제 구현 시 대체해주세요
const fetchPropertyDetail = async (id) => {
  // 실제 API 호출로 대체
  return {
    id: id,
    address: "서울시 강남구 역삼동 123-456",
    fullAddress: "서울특별시 강남구 역삼동 123-456 그린아파트 101동 505호",
    type: "아파트",
    deposit: 5000,
    monthlyRent: 80,
    area: 84.12,
    floorInfo: "5층/15층",
    moveInDate: "즉시 입주 가능",
    features: "신축, 역세권, 주차 가능, 남향",
    description:
      "역삼역 도보 5분 거리에 위치한 신축 아파트입니다. 햇빛이 잘 들어오는 남향 구조로, 주변 환경이 조용하고 편의시설이 잘 갖추어져 있습니다.",
    realtor: "그린 부동산",
    realtorContact: "010-1234-5678",
    latitude: 37.501526,
    longitude: 127.036683,
    images: [
      "/images/property1-1.jpg",
      "/images/property1-2.jpg",
      "/images/property1-3.jpg",
      "/images/property1-4.jpg",
    ],
    amenities: ["에어컨", "세탁기", "냉장고", "가스레인지", "옷장"],
    transportationOptions: [
      { name: "역삼역 2번 출구", distance: "도보 5분" },
      { name: "강남역 4번 출구", distance: "도보 15분" },
      { name: "버스 2412, 6006", distance: "도보 3분" },
    ],
  };
};

const EstateDetailPage = () => {
  const { estateId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [map, setMap] = useState(null);

  useEffect(() => {
    const getPropertyDetail = async () => {
      try {
        const data = await fetchPropertyDetail(estateId);
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching property details:", error);
        setLoading(false);
      }
    };

    getPropertyDetail();
  }, [estateId]);

  useEffect(() => {
    // 카카오맵 API 연동 부분
    console.log("지도를 표시할 위치:", property?.latitude, property?.longitude);
  }, [property]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="매물을 찾을 수 없습니다"
          description="요청하신 매물 정보를 찾을 수 없습니다."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={property.address} description={property.type} />

      {/* 가격 정보 및 핵심 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-green-800">
              {property.deposit} 만원
            </h2>
            {property.monthlyRent > 0 && (
              <p className="text-lg text-gray-700">
                월세 {property.monthlyRent} 만원
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">면적</span>
            <span className="font-semibold">{property.area} m²</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">층수</span>
            <span className="font-semibold">{property.floorInfo}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">입주 가능일</span>
            <span className="font-semibold">{property.moveInDate}</span>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 ${
              activeTab === "info"
                ? "border-b-2 border-green-800 text-green-800 font-medium"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("info")}
          >
            상세 정보
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "location"
                ? "border-b-2 border-green-800 text-green-800 font-medium"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("location")}
          >
            위치 정보
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "agent"
                ? "border-b-2 border-green-800 text-green-800 font-medium"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("agent")}
          >
            중개사 정보
          </button>
        </div>

        {/* 상세 정보 탭 */}
        {activeTab === "info" && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h3 className="text-xl font-semibold mb-4">매물 정보</h3>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">매물 특징</h4>
              <p className="text-gray-800">{property.features}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">상세 설명</h4>
              <p className="text-gray-800 whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">옵션 정보</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {property.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 위치 정보 탭 */}
        {activeTab === "location" && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h3 className="text-xl font-semibold mb-4">위치 정보</h3>

            <div className="mb-4">
              <p className="text-gray-800">{property.fullAddress}</p>
            </div>

            <div id="map" className="w-full h-96 rounded-lg mb-6"></div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">교통 정보</h4>
              <ul className="space-y-2">
                {property.transportationOptions.map((option, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-6 h-6 bg-green-800 text-white rounded-full flex items-center justify-center mr-2 text-xs">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium">{option.name}</span>
                      <span className="text-gray-600 text-sm ml-2">
                        {option.distance}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 중개사 정보 탭 */}
        {activeTab === "agent" && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h3 className="text-xl font-semibold mb-4">중개사 정보</h3>

            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                <span className="text-2xl text-gray-500">👤</span>
              </div>
              <div>
                <h4 className="text-lg font-medium">{property.realtor}</h4>
                <p className="text-gray-600">{property.realtorContact}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstateDetailPage;
