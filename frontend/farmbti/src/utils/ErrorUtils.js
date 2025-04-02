export const handleErrorToast = (error, toast) => {
  // 오류 객체가 없거나 적절하지 않은 경우
  if (!error) {
    toast.error("알 수 없는 오류가 발생했습니다");
    return;
  }

  // 1. error가 표준 응답 형식일 경우 (success, error 속성이 있음)
  if (error.success === false && error.error) {
    const { code, type, message } = error.error;

    if (type === "BUSINESS") {
      toast.warning(message);
    } else {
      switch (code) {
        case "AUTH_EXPIRED":
          toast.info("로그인이 만료되었습니다. 다시 로그인해주세요");
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          toast.error(
            "서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요"
          );
          break;
        default:
          toast.error(message || "요청을 처리하는 중 오류가 발생했습니다");
      }
    }
    return;
  }

  // 2. error 자체에 code, message 등이 있는 경우 (일부 API 오류)
  if (error.code || error.message) {
    const message = error.message || "요청을 처리하는 중 오류가 발생했습니다";
    toast.error(message);
    return;
  }

  // 3. 그 외 모든 경우
  toast.error("요청을 처리하는 중 오류가 발생했습니다");
};
