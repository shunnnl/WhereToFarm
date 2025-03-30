import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import PaginationComponent from "../../components/common/Pagination";
import { getNewsList } from "../../API/etc/NewsAPI";
import { toast } from "react-toastify";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const NewsPage = () => {
  const [newsList, setNewsList] = useState([
    { id: 1, title: "뉴스 타이틀 1", date: "2025-01-13", views: 5 },
    { id: 3, title: "뉴스 타이틀 1", date: "2025-01-13", views: 5 },
    { id: 9, title: "뉴스 타이틀 1", date: "2025-01-13", views: 5 },
    { id: 11, title: "뉴스 타이틀 1", date: "2025-01-13", views: 5 },
  ]);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await getNewsList();
        setNewsList(response);
      } catch (error) {
        console.log("뉴스 불러오기 에러: ", error);
        toast.error(error.message || "뉴스 목록 불러오기에 실패했습니다.");
      }
    };

    getNews();
  }, []);

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  // 현재 페이지에 표시할 아이템 계산
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsList.slice(indexOfFirstItem, indexOfLastItem);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "유효하지 않은 날짜 형식";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <PageHeader
        title="귀농 뉴스"
        description="귀농 관련 최신 소식과 정보를 확인하세요"
      />

      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              최신 귀농 소식
            </h2>
            <div className="text-sm text-gray-500">
              총{" "}
              <span className="font-medium text-green-700">
                {newsList.length}
              </span>
              개의 뉴스
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {currentItems.map((news, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded text-sm font-medium flex-shrink-0">
                    {(activePage - 1) * itemsPerPage + index + 1}
                  </span>
                  <div className="ml-4 flex-grow">
                    <a
                      href={news.link}
                      className="text-gray-800 font-medium hover:text-green-700 transition-colors line-clamp-1"
                    >
                      {news.title}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 ml-4 flex-shrink-0">
                    <Calendar size={14} className="mr-1" />
                    {convertDate(news.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentItems.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              등록된 뉴스가 없습니다.
            </div>
          )}

          <div className="p-4 border-t border-gray-200">
            <PaginationComponent
              activePage={activePage}
              totalItemsCount={newsList.length}
              onChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              className="flex justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
