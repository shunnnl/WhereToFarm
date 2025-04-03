import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// 최근 표시된 오류를 추적하기 위한 맵
const recentErrors = new Map();
const ERROR_THRESHOLD_MS = 2000; // 2초 이내 중복 방지

const ErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    // API 에러 처리 함수
    const handleApiError = (event) => {
      const { code, message, type } = event.detail;
      const now = Date.now();

      // 토스트 ID 생성
      const toastId = `error-${code}`;

      // 최근에 동일한 오류가 표시되었는지 확인
      const lastErrorTime = recentErrors.get(toastId);
      if (lastErrorTime && now - lastErrorTime < ERROR_THRESHOLD_MS) {
        return; // 중복 방지
      }

      // 현재 시간 기록
      recentErrors.set(toastId, now);

      // 오류 유형에 따른 토스트 스타일 적용
      if (type === "BUSINESS") {
        toast.warning(message, { toastId });
      } else if (code === "AUTH_EXPIRED") {
        toast.info(message, { toastId });
      } else {
        toast.error(message || "오류가 발생했습니다", { toastId });
      }

      // 심각한 오류일 때만 라우팅
      if ([404, 500, 502, 503, 504, "NETWORK"].includes(code)) {
        setTimeout(() => {
          if (code === 404) {
            navigate("/error/not-found", { state: { message } });
          } else {
            navigate("/error/server", { state: { code, message } });
          }
        }, 1500); // 토스트 메시지를 볼 수 있도록 1.5초 딜레이
      }
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
