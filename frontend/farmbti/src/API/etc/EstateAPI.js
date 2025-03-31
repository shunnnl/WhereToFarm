import { publicAxios } from "../common/AxiosInstance";

export const getAllEstate = async (page, size) => {
  try {
    const response = await publicAxios.get(
      `/property/list?page=${page}&size=${size}`
    );
    if (!response.success) {
      throw response.error;
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.error;
  }
};

export const getFilteredEstate = async (province, city) => {
  try {
    const response = await publicAxios.post("/property/search", {
      do_: province,
      city: city,
    });
    if (!response.success) {
      throw response.error;
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.error;
  }
};

export const getEstateDetail = async (estateId) => {
  try {
    const response = await publicAxios.get(`/property/${estateId}`);
    if (!response.success) {
      throw response.error;
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.error;
  }
};
