import { authAxios } from "../common/AxiosInstance";

export const getCalculateReports = async () => {
  try {
    const response = await authAxios.get("/crops/get/all");

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const cropsReportsDeatil = async (reportId) => {
  try {
    const response = await authAxios.get(`/crops/get/${reportId}`);
    if (!response.success) {
      console.log(response);
      throw response.error;
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteCropsReports = async (reportId) => {
  try {
    const response = await authAxios.delete(`/crops/delete/${reportId}`);
    if (!response.success) {
      console.log(response);
      throw response.error;
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}