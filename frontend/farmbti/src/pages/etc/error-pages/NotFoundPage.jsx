import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFoundPage = ({ message = "이 페이지에 접근할 수 없습니다. 주소를 확인해 주세요." }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-secondaryYellow-light rounded-full flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-primaryGreen" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-center mb-2 text-textColor-black">
          페이지를 찾을 수 없습니다
        </h2>
        
        <p className="text-textColor-darkgray text-center mb-6">
          {message}
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="w-full py-3 bg-primaryGreen text-textColor-white text-center rounded-lg shadow-md hover:bg-supportGreen transition-colors duration-300"
          >
            홈으로 돌아가기
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full py-3 bg-accentGreen-light text-textColor-black text-center rounded-lg hover:bg-accentGreen transition-colors duration-300"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
