import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import PaginationComponent from "../../components/common/Pagination";

const NewsPage = () => {
  const [newsList, setNewsList] = useState([
    { id: 1, title: "뉴스 타이틀 1", date: "2025-01-13", views: 5 },
    { id: 3, title: "뉴스 타이틀 1", date: "2025-01-13", views: 5 },
    { id: 9, title: "뉴스 타이틀 1", date: "2025-01-13", views: 5 },
    { id: 11, title: "뉴스 타이틀 1", date: "2025-01-13", views: 5 },
  ]);

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 2; // 2x2 그리드에 맞는 4개 항목

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  // 현재 페이지에 표시할 아이템 계산
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <PageHeader
        title={"귀농 뉴스"}
        description={"귀농 관련 뉴스를 알려드립니다."}
      />
      <div className="news-container w-auto bg-background">
        <div className="w-full max-w-4xl mx-auto pt-10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 rounded-lg">
                  <th className="py-3 px-4 text-center font-medium text-gray-600 w-16 border-b">
                    번호
                  </th>
                  <th className="py-3 px-4 text-center font-medium text-gray-600 border-b">
                    제목
                  </th>
                  <th className="py-3 px-4 text-center font-medium text-gray-600 w-32 border-b">
                    작성일
                  </th>
                  <th className="py-3 px-4 text-center font-medium text-gray-600 w-20 border-b">
                    조회수
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, index) => (
                  <tr key={index} className="bg-white">
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-700">
                      {row.id}
                    </td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-800 font-medium">
                      {row.title}
                    </td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-600">
                      {row.date}
                    </td>
                    <td className="py-3 px-4 border-b text-center border-gray-200 text-gray-600">
                      {row.views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="my-5 pb-5">
          <PaginationComponent
            activePage={activePage}
            totalItemsCount={newsList.length}
            onChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
