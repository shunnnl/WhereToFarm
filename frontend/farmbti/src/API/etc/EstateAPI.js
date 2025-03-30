import { authAxios } from "../common/AxiosInstance";

export const getAllEstate = async () => {
  try {
    const response = await authAxios.get("/property");
    if (!response.success){
      throw response.error;
    }
    return response.data;
  } catch (error) {
     console.log(error);
     throw error;
  }
};
