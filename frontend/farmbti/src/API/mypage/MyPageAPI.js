import { authAxios } from "../common/AxiosInstance";

export const getMyPage = async () => {
  try {
    const response = await authAxios.get("/users/me");

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCalculateReports = async () => {
  try {
    const response = await authAxios.get("/crops/get/all");

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.log(error);
    throw error.error;
  }
};

export const putMyInfo = async (data) => {
  try {
    const response = await authAxios.put("/users/modify", data);
    if (!response.success) {
      throw response.error;
    }
    return response.success; // 응답에 데이터 null 성공 여부만 가져오기
  } catch (error) {
    console.log(error);
    throw error.error;
  }
};

export const changePassword = async (data) => {
  try {
    const response = await authAxios.post("/users/password", data);
    if (!response.success) {
      throw response.error;
    }
    return response.success; // 응답에 데이터 null 성공 여부만 가져오기
  } catch (error) {
    console.log(error);
    throw error.error;
  }
};
