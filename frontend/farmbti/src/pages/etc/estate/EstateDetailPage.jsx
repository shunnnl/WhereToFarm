import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import { getEstateDetail } from "../../../API/etc/EstateAPI";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const EstateDetailPage = () => {
  const { estateId } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  // 지도 관련 state 제거 및 기본 탭만 유지
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    window.scrollTo(0, 0);
    const getPropertyDetail = async () => {
      try {
        const data = await getEstateDetail(estateId);
        setProperty(data);
        setisLoading(false);
      } catch (error) {
        console.error("Error fetching property details:", error);
        setisLoading(false);
        toast.error(error.message || "부동산 상세 조회를 할 수 없습니다.");
      }
    };

    getPropertyDetail();
  }, [estateId]);

  // 지도 관련 useEffect 제거

  if (!property) {
    return (
      <>
        <PageHeader
          title="매물 상세 보기"
          description="선택하신 매물의 상세 정보를 살펴보세요."
        />
        <div className="container mx-auto px-4 py-10 flex justify-center">
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center max-w-md">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              매물을 찾을 수 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              요청하신 매물 정보가 존재하지 않습니다.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-primaryGreen text-white px-4 py-2 rounded text-sm"
            >
              이전 페이지로
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="매물 상세 보기"
        description="선택하신 매물의 상세 정보를 살펴보세요."
      />
      <div className="container mx-auto px-4 bg-gray-50">
        {isLoading ? (
          <LoadingSpinner text="정보 불러오는 중..." />
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 mt-5">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex flex-col gap-7">
                  <div className="md:mb-0">
                    <span className="text-sm text-gray-500">매매 가격</span>
                    <h2 className="text-2xl font-bold text-green-800">
                      {property.deposit.toLocaleString()} 만원
                    </h2>
                  </div>
                  <div className="md:mb-0">
                    <span className="text-sm text-gray-500">주소</span>
                    <h2 className="text-2xl font-bold text-green-800">
                      {property.address}
                    </h2>
                  </div>
                </div>
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                  {property.agency}
                </div>
              </div>
            </div>

            {/* 부동산 정보 섹션 - 탭 네비게이션 없이 직접 표시 */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">
                      기본 정보
                    </h3>

                    <div className="flex justify-between">
                      <span className="text-gray-600">면적</span>
                      <span className="font-medium">
                        {property.area.toLocaleString()} m²
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">주소</span>
                      <span className="font-medium">{property.address}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">
                      거래 정보
                    </h3>

                    <div className="flex justify-between">
                      <span className="text-gray-600">매매 가격</span>
                      <span className="font-medium">
                        {property.deposit.toLocaleString()} 만원
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">중개사무소</span>
                      <span className="font-medium">{property.agency}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">추가 정보</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium mb-2">특징</p>
                    <p>{property.feature}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EstateDetailPage;
