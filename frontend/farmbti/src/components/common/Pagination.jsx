import React from "react";
import Pagination from "react-js-pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const PaginationComponent = ({
  activePage,
  totalItemsCount,
  onChange,
  itemsPerPage = 8,
}) => {
  // 아이콘을 감싸는 컴포넌트 생성
  const IconWrapper = ({ children }) => (
    <div className="flex items-center justify-center w-full h-full">
      {children}
    </div>
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);

  // 첫 페이지인지 확인
  const isFirstPage = activePage === 1;

  // 마지막 페이지인지 확인
  const isLastPage = activePage === totalPages;

  return (
    <div className="flex flex-col items-center mt-4">
      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={totalItemsCount}
        pageRangeDisplayed={5}
        onChange={onChange}
        itemClass="px-2 py-0.5 mx-1 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center h-8 min-w-8"
        activeClass="bg-green-800 text-white"
        linkClass="outline-none flex items-center justify-center h-full w-full"
        innerClass="flex flex-row items-center justify-center"
        disabledClass="opacity-50 cursor-not-allowed hover:bg-gray-200 pointer-events-none"
        prevPageText={
          <IconWrapper>
            <ChevronLeft size={16} />
          </IconWrapper>
        }
        nextPageText={
          <IconWrapper>
            <ChevronRight size={16} />
          </IconWrapper>
        }
        firstPageText={
          <IconWrapper>
            <ChevronsLeft size={16} />
          </IconWrapper>
        }
        lastPageText={
          <IconWrapper>
            <ChevronsRight size={16} />
          </IconWrapper>
        }
        hideDisabled={false}
      />
    </div>
  );
};

export default PaginationComponent;
