import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const AuthRequiredPage = () => {
  const navigate = useNavigate();

  // 3초 후 로그인 페이지로 리다이렉트
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H8m11 4l-5-5 5-5M6 10l5 5-5 5"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">
          로그인이 필요합니다
        </h2>
        <p className="text-gray-600 text-center mb-6">
          이 페이지에 접근하려면 로그인이 필요합니다. 3초 후 로그인 페이지로
          이동합니다.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/login"
            className="w-full py-3 bg-blue-600 text-white text-center rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            로그인하기
          </Link>
          <Link
            to="/"
            className="w-full py-3 bg-gray-200 text-gray-800 text-center rounded-lg hover:bg-gray-300 transition-colors duration-300"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredPage;
