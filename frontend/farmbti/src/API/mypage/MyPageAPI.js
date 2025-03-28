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
    console.log(response)
    if (!response.success) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error.error;
  }
};

export const putMentorInfo = async (data) => {

}

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

export const deleteUser = async (data) => {
  try {
    console.log(data);
    const response = await authAxios.delete("/users/delete", { data: data });
    if (!response.success) {
      throw response.error;
    }
    return response.success; // 응답에 데이터 null 성공 여부만 가져오기
  } catch (error) {
    console.log(error);
    throw error.error;
  }
};

export const uploadImage = async (file) => {
  try {
    const response = await authAxios.put("/users/upload-profile", file, {
      headers: {
        "Content-Type": undefined,
      },
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

export const deleteImage = async () => {
  try {
    const response = await authAxios.put("/users/reset-default");
    console.log(response)
    if (!response.success) {
      throw response.error;
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.error;
  }
}
