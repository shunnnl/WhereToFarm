import { authAxios } from "../common/AxiosInstance";

export const getMyPage = async () => {
  try {
    const response = await authAxios.get("/users/me");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const putMyInfo = async (data) => {
  try {
    const response = await authAxios.put("/users/modify", data);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const putMentorInfo = async (data) => {
  try {
    const response = await authAxios.put("/mentors/modify", data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const response = await authAxios.post("/users/password", data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteUser = async (data) => {
  try {
    const response = await authAxios.delete("/users/delete", { data: data });
    return response.success; // 응답에 데이터 null 성공 여부만 가져오기
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const response = await authAxios.put("/users/upload-profile", file, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteImage = async () => {
  try {
    const response = await authAxios.put("/users/reset-default");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
