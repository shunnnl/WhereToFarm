import { publicAxios } from "../common/AxiosInstance";

export const getAllEstate = async (page, size) => {
  try {
    const response = await publicAxios.get(
      `/property/list?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFilteredEstate = async (province, city, page, size) => {
  try {
    const response = await publicAxios.post(
      `/property/search?page=${page}&size=${size}`,
      {
        do_: province,
        city: city,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getEstateDetail = async (estateId) => {
  try {
    const response = await publicAxios.get(`/property/${estateId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
