import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ServerErrorPage = () => {
  const location = useLocation();
  const { code = "500", message = "서버에 문제가 발생했습니다." } =
    location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-secondaryYellow-light rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-primaryGreen" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2 text-textColor-black">
          서버 오류 {code}
        </h2>

        <p className="text-textColor-darkgray text-center mb-6">{message}</p>

        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="w-full py-3 bg-primaryGreen text-textColor-white text-center rounded-lg hover:bg-accentGreen transition-colors duration-300"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
