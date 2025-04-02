export const handleErrorToast = (error, toast) => {
  if (!error || !error.error) {
    toast.error("알 수 없는 오류가 발생했습니다");
    return;
  }

  const { code, type, message } = error.error;

  if (type === "BUSINESS") {
    // 비즈니스 로직 오류는 서버에서 온 메시지 그대로 표시
    toast.warning(message);
  } else {
    // 시스템 오류는 특정 케이스별로 적절한 메시지 표시
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
        toast.error("요청을 처리하는 중 오류가 발생했습니다");
    }
  }
};
