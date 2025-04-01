import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // API 에러 처리 함수
    const handleApiError = (event) => {
      const { code, message } = event.detail;

      // 토스트 메시지 표시
      toast.error(message || "오류가 발생했습니다");

      // 약간의 딜레이 후 에러 페이지로 라우팅
      setTimeout(() => {
        if (code === 404) {
          navigate("/error/not-found", { state: { message } });
        } else if (code >= 500 || code === "NETWORK") {
          navigate("/error/server", { state: { code, message } });
        }
      }, 1500); // 토스트 메시지를 볼 수 있도록 1.5초 딜레이
    };

    // 이벤트 리스너 등록
    window.addEventListener("api-error", handleApiError);

    // 클린업 함수
    return () => {
      window.removeEventListener("api-error", handleApiError);
    };
  }, [navigate]);

  return null; // UI 렌더링 없음
};

export default ErrorHandler;
