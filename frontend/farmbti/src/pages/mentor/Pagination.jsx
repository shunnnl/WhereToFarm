// Pagination.js
import React from 'react';
import Pagination from 'react-js-pagination'; 

const PaginationComponent = ({ activePage, totalItemsCount, onChange, itemsPerPage = 8 }) => {
  return (
    <div className="flex flex-col items-center mt-4">
      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={totalItemsCount}
        pageRangeDisplayed={5}
        onChange={onChange}
        itemClass="px-2 py-0.5 mx-1 rounded bg-gray-200 hover:bg-gray-300"
        activeClass="bg-green-800 text-white"
        linkClass="outline-none"
        innerClass="flex flex-row items-center justify-center"

      />
      
      {/* <div className="text-center text-sm text-green-500 mt-2">
        Page {activePage} of {Math.ceil(totalItemsCount / itemsPerPage)} (Total: {totalItemsCount} regions)
      </div> */}
    </div>
  );
};

export default PaginationComponent;