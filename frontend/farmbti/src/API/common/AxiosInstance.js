import axios from "axios";

// 표준화된 오류 응답 객체 생성 함수
const createErrorResponse = (code, message, originalError = null) => {
  return {
    success: false,
    data: null, // data 필드 추가
    error: {
      code,
      message,
      // status 필드 추가 (숫자 코드는 status로, 문자열 코드는 그대로 code로)
      status: typeof code === "number" ? code : 400,
      // type 필드는 내부적으로 사용
      type:
        typeof code === "number" && code >= 400 && code < 500
          ? "BUSINESS"
          : "SYSTEM",
      // details는 개발 환경에서만 포함
      ...(process.env.NODE_ENV === "development" && { details: originalError }),
    },
  };
};

const handleApiError = (error) => {
  // HTTP 상태 코드별 오류 메시지
  const statusMessages = {
    400: "잘못된 요청입니다.",
    401: "인증이 필요합니다.",
    403: "접근 권한이 없습니다.",
    404: "찾는 정보가 없어요!",
    409: "요청이 충돌했습니다.",
    422: "요청 데이터가 유효하지 않습니다.",
    429: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    500: "서버에 문제가 생겼어요!",
    502: "서버 게이트웨이에 문제가 발생했습니다.",
    503: "서비스를 일시적으로 사용할 수 없습니다.",
    504: "서버 응답 시간이 초과되었습니다.",
  };

  let errorResponse;

  let errorData = {
    code: "UNKNOWN",
    message: "알 수 없는 오류가 발생했습니다",
    type: "SYSTEM",
  };

  // 응답이 있는 경우의 에러 처리
  if (error.response) {
    const status = error.response.status;
    const message =
      statusMessages[status] || "요청을 처리하는 중 오류가 발생했습니다.";

    errorData = {
      code: status,
      message: message,
      type: status >= 400 && status < 500 ? "BUSINESS" : "SYSTEM",
    };

    // 서버에서 표준화된 오류 객체를 보냈는지 확인
    if (
      error.response.data &&
      error.response.data.success === false &&
      error.response.data.error
    ) {
      // 서버 오류 객체에서 데이터 추출
      errorData = {
        code: error.response.data.error.code,
        message: error.response.data.error.message,
        type:
          error.response.data.error.type ||
          (typeof error.response.data.error.code === "number" &&
          error.response.data.error.code >= 400 &&
          error.response.data.error.code < 500
            ? "BUSINESS"
            : "SYSTEM"),
      };

      // 사용자에게 알림 이벤트 발생 - 더 상세한 정보 포함
      window.dispatchEvent(
        new CustomEvent("api-error", {
          detail: errorData,
        })
      );

      return error.response.data;
    }

    // 사용자에게 알림 이벤트 발생
    window.dispatchEvent(
      new CustomEvent("api-error", {
        detail: errorData,
      })
    );

    errorResponse = createErrorResponse(status, message, error.response.data);
  }
  // 네트워크 오류 처리
  else if (error.request) {
    errorData = {
      code: "NETWORK",
      message: "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.",
      type: "SYSTEM",
    };

    window.dispatchEvent(
      new CustomEvent("api-error", {
        detail: errorData,
      })
    );

    errorResponse = createErrorResponse(
      "NETWORK",
      "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.",
      error
    );
  }
  // 기타 오류 처리
  else {
    errorData = {
      code: "ERROR",
      message: "요청 처리 중 오류가 발생했습니다.",
      type: "SYSTEM",
    };

    window.dispatchEvent(
      new CustomEvent("api-error", {
        detail: errorData,
      })
    );

    errorResponse = createErrorResponse(
      "ERROR",
      "요청 처리 중 오류가 발생했습니다.",
      error
    );
  }

  return errorResponse;
};

// refreshToken을 이용한 토큰 갱신 함수
const refreshAccessToken = async () => {
  try {
    // 기존 코드 유지
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (
      response.data.success &&
      response.data.data &&
      response.data.data.token
    ) {
      localStorage.setItem("accessToken", response.data.data.token.accessToken);
      localStorage.setItem(
        "refreshToken",
        response.data.data.token.refreshToken
      );
      localStorage.setItem(
        "tokenExpires",
        response.data.data.token.accessTokenExpiresInForHour
      );

      return response.data.data.token.accessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    // 로컬 스토리지 정리
    handleLogout();
    return Promise.reject(error);
  }
};


// 인증 요구 api
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인증 요구 API 요청 가로채기
authAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    const errorResponse = handleApiError(error);
    return Promise.reject(errorResponse);
  }
);

// 응답 인터셉터
authAxios.interceptors.response.use(
  (response) => {
    // 기존 코드 유지
    if (response.data && response.data.success !== undefined) {
      if (response.data.success === false) {
        return Promise.reject(response.data);
      }
      return response.data;
    }
    return { success: true, data: response.data };
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 오류 시 토큰 갱신 시도
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return authAxios(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // 403 오류도 로그아웃 처리
    if (error.response && error.response.status === 403) {
      handleLogout();
    }

    const errorResponse = handleApiError(error);
    return Promise.reject(errorResponse);
  }
);


// AxiosInstance.js에 간단한 로그아웃 함수 추가
function handleLogout() {
  // 로컬 스토리지 정리
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpires");
  localStorage.removeItem("user");
  
  // 페이지 리디렉션 (로그인 페이지가 아닌 경우에만)
  if (window.location.pathname !== '/login') {
    window.location.href = '/login?reason=session_expired';
  }
}








// 인증이 필요없는 api
const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
publicAxios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    const errorResponse = handleApiError(error);
    return Promise.reject(errorResponse);
  }
);

// 응답 인터셉터
publicAxios.interceptors.response.use(
  (response) => {
    // 데이터가 이미 표준화된 형식인지 확인
    if (response.data && response.data.success !== undefined) {
      // success가 false인 경우 오류로 처리
      if (response.data.success === false) {
        return Promise.reject(response.data);
      }
      return response.data;
    }

    // 표준화된 응답 객체로 변환
    return {
      success: true,
      data: response.data,
    };
  },
  (error) => {
    const errorResponse = handleApiError(error);
    return Promise.reject(errorResponse);
  }
);

export { authAxios, publicAxios };
