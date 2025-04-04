import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import { getEstateDetail } from "../../../API/etc/EstateAPI";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { ChevronLeft } from "lucide-react";
import { handleError } from "../../../utils/ErrorUtil";

const EstateDetailPage = () => {
  const { estateId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

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
        handleError(error);
        console.error(error);
      }
    };

    getPropertyDetail();
  }, [estateId]);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader
          title="매물 상세 보기"
          description="선택하신 매물의 상세 정보를 살펴보세요."
        />
        <div className="container mx-auto px-4 py-12 pb-16 flex justify-center flex-grow">
          <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center max-w-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              매물을 찾을 수 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              요청하신 매물 정보가 존재하지 않습니다.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-primaryGreen text-white px-6 py-2 rounded text-sm flex items-center mx-auto gap-2"
            >
              <ChevronLeft size={16} /> 이전 페이지로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="매물 상세 보기"
        description="선택하신 매물의 상세 정보를 살펴보세요."
      />
      <div className="container mx-auto px-6 bg-gray-50 flex-grow pb-16">
        {isLoading ? (
          <LoadingSpinner text="정보 불러오는 중..." />
        ) : (
          <>
            <button
              onClick={handleGoBack}
              className="px-4 py-3 rounded text-md flex items-center gap-2 my-4 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={18} /> 이전 페이지로
            </button>
            <div className="bg-white rounded-lg shadow-md p-8 mb-10 mt-6 mx-20">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="flex flex-col gap-8">
                  <div className="md:mb-0">
                    <span className="text-sm text-gray-500 mb-2 block">
                      매매 가격
                    </span>
                    <h2 className="text-2xl font-bold text-green-800">
                      {property.deposit.toLocaleString()} 만원
                    </h2>
                  </div>
                  <div className="md:mb-0">
                    <span className="text-sm text-gray-500 mb-2 block">
                      주소
                    </span>
                    <h2 className="text-2xl font-bold text-green-800">
                      {property.address}
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-3 bg-green-100 text-green-800 rounded-full font-medium mt-6 md:mt-0">
                  {property.agency}
                </div>
              </div>
            </div>

            <div className="mb-16">
              <div className="bg-white rounded-lg shadow-md p-8 mt-6 mx-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b border-gray-200 pb-3">
                      기본 정보
                    </h3>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">면적</span>
                      <span className="font-medium">
                        {property.area.toLocaleString()} m²
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">주소</span>
                      <span className="font-medium">{property.address}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b border-gray-200 pb-3">
                      거래 정보
                    </h3>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">매매 가격</span>
                      <span className="font-medium">
                        {property.deposit.toLocaleString()} 만원
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">중개사무소</span>
                      <span className="font-medium">{property.agency}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">추가 정보</h3>
                  <div className="bg-gray-50 p-6 rounded-md">
                    <p className="font-medium mb-3">특징</p>
                    <p className="leading-relaxed">{property.feature}</p>
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
