import { authAxios } from "../common/AxiosInstance";

export const estimateCrops = async (myAreaVolume, cropsName) => {
  try {
    const response = await authAxios.post("/crops/estimate", {
      myAreaVolume,
      cropsName,
    });

    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const saveResult = async (reportId) => {
  try {
    const response = await authAxios.post(`/crops/estimate/${reportId}`, {});
    return response.success;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
