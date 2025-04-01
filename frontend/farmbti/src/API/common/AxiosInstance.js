import axios from "axios";

// 인증 요구 api
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("authAxios baseURL:", authAxios.defaults.baseURL);

// 인증 요구 API 요청 가로채기 (수정)
authAxios.interceptors.request.use(
  (config) => {
    // 'token'이 아닌 'accessToken' 사용
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// refreshToken을 이용한 토큰 갱신 함수
const refreshAccessToken = async () => {
  try {
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
    
    if (response.data.success && response.data.data && response.data.data.token) {
      localStorage.setItem("accessToken", response.data.data.token.accessToken);
      localStorage.setItem("refreshToken", response.data.data.token.refreshToken);
      localStorage.setItem("tokenExpires", response.data.data.token.accessTokenExpiresInForHour);
      
      // 'token' 키도 일관성을 위해 설정 (기존 코드와의 호환성 위해)
      localStorage.setItem("accessToken", response.data.data.token.accessToken);
      
      return response.data.data.token.accessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    // 리프레시 토큰 실패 시 로그아웃 처리
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpires");
    localStorage.removeItem("user");
    return Promise.reject(error);
  }
};



// 응답 인터셉터
authAxios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료로 인한 401 에러이고, 이전에 재시도하지 않은 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return authAxios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // 응답이 있는 경우의 에러 처리
    if (error.response) {
      if (error.response.status === 404) {
        // 이벤트 발생
        window.dispatchEvent(
          new CustomEvent("api-error", {
            detail: { code: 404, message: "찾는 정보가 없어요!" },
          })
        );
      }

      // 서버 에러 발생!
      if (error.response.status >= 500) {
        window.dispatchEvent(
          new CustomEvent("api-error", {
            detail: { code: 500, message: "서버에 문제가 생겼어요!" },
          })
        );
      }
    }
    // 요청은 보냈지만 응답이 없는 경우 (네트워크 오류)
    else if (error.request) {
      console.error("네트워크 연결 오류:", error.request);
      window.dispatchEvent(
        new CustomEvent("api-error", {
          detail: {
            code: "NETWORK",
            message: "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.",
          },
        })
      );
    }
    // 요청 설정 중 오류 발생 (미처리 예외)
    else {
      console.error("요청 설정 오류:", error.message);
      window.dispatchEvent(
        new CustomEvent("api-error", {
          detail: {
            code: "ERROR",
            message: "요청 처리 중 오류가 발생했습니다.",
          },
        })
      );
    }

    return Promise.reject(error.response?.data || error);
  }
);

// 인증이 필요없는 api
const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },

});

publicAxios.interceptors.request.use(
  (config) => {
    console.log("config =========", config)
    console.log("authAxios public:", publicAxios.defaults.baseURL);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

publicAxios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 응답이 있는 경우의 에러 처리
    if (error.response) {
      if (error.response.status === 404) {
        window.dispatchEvent(
          new CustomEvent("api-error", {
            detail: { code: 404, message: "찾는 정보가 없어요!" },
          })
        );
      }

      if (error.response.status >= 500) {
        window.dispatchEvent(
          new CustomEvent("api-error", {
            detail: { code: 500, message: "서버에 문제가 생겼어요!" },
          })
        );
      }
    }
    // 네트워크 오류 처리
    else if (error.request) {
      console.error("네트워크 연결 오류:", error.request);
      window.dispatchEvent(
        new CustomEvent("api-error", {
          detail: {
            code: "NETWORK",
            message: "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.",
          },
        })
      );
    }
    // 기타 오류
    else {
      console.error("요청 설정 오류:", error.message);
      window.dispatchEvent(
        new CustomEvent("api-error", {
          detail: {
            code: "ERROR",
            message: "요청 처리 중 오류가 발생했습니다.",
          },
        })
      );
    }

    return Promise.reject(error.response?.data || error);
  }
);





export { authAxios, publicAxios };
