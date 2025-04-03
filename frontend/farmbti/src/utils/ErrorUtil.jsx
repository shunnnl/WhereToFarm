import { toast } from "react-toastify";

export const handleError = (error, defaultMessage = "오류가 발생했습니다") => {
  console.error("오류 발생:", error);
  
  // 오류 객체가 API에서 반환된 예상 형식인지 확인
  if (error && error.success === false && error.error) {
    // ErrorHandler가 감지할 수 있도록 api-error 이벤트를 수동으로 발생시킴
    window.dispatchEvent(
      new CustomEvent("api-error", {
        detail: {
          code: error.error.code,
          message: error.error.message,
          type: error.error.type || "BUSINESS"
        }
      })
    );
  } else {
    // 예상치 못한 형식의 오류일 경우 기본 메시지 표시
    toast.error(defaultMessage);
  }
  
  // 오류 객체 반환 (필요한 경우 추가 처리를 위해)
  return error;
};