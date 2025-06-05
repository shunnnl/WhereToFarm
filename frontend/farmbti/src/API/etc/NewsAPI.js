import { publicAxios } from "../common/AxiosInstance"

export const getNewsList = async () => {
  try {
    const response = await publicAxios.get("/news/list");
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
};

export const getTop3News = async () => {
  try {
    const response = await publicAxios.get("/news/main");
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}