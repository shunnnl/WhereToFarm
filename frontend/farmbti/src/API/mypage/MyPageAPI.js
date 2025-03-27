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
}
