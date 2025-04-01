import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserCheck } from "lucide-react";

const AuthRequiredPage = () => {
  const navigate = useNavigate();

  // 5초 후 로그인 페이지로 리다이렉트
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-secondaryYellow-light rounded-full flex items-center justify-center">
            <UserCheck className="h-8 w-8 text-primaryGreen" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2 text-textColor-black">
          로그인이 필요합니다
        </h2>
        <p className="text-textColor-darkgray text-center mb-6">
          이 페이지에 접근하려면 로그인이 필요합니다. 5초 후 로그인 페이지로
          이동합니다.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/login"
            className="w-full py-3 bg-primaryGreen text-textColor-white text-center rounded-lg shadow-md hover:bg-supportGreen transition-colors duration-300"
          >
            로그인하기
          </Link>
          <Link
            to="/"
            className="w-full py-3 bg-accentGreen-light text-textColor-black text-center rounded-lg hover:bg-accentGreen transition-colors duration-300"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredPage;