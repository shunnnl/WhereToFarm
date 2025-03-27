import { authAxios } from "../common/AxiosInstance";

export const submit = async (myAreaVolume, cropsName) => {
  try {
    const response = await authAxios.post("/crops/estimate", {
      myAreaVolume,
      cropsName,
    });

    if (!response.success) {
      // API 응답은 성공했지만 비즈니스 로직 오류가 있는 경우
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};
