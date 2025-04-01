import { publicAxios } from "../common/AxiosInstance";

export const getTop3Support = async () => {
  try {
    const response = await publicAxios.get("/policy/main");
    if (!response.success) {
      throw response.error;
    }
    return response.data;
  } catch (error) {
    console.error("Top3 헤택 요청 오류:", error);
    throw new Error(error.message || "혜택을 불러오는데 실패했습니다.");
  }
};
