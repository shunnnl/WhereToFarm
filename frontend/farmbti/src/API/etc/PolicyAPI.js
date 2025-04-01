import { publicAxios } from "../common/AxiosInstance"

// 전체 정책 조회 (GET)
export const getAllPolicyList = async (page = 0, size = 10) => {
  try {
    const response = await publicAxios.get(`/policy?page=${page}&size=${size}`);
    console.log('GET API Response:', response);

    const responseData = response.data;
    if (responseData?.content) {
      return {
        content: responseData.content,
        totalElements: responseData.totalElements,
        totalPages: responseData.totalPages,
        currentPage: responseData.number + 1
      };
    } else {
      throw new Error('응답 데이터가 올바르지 않습니다.');
    }
  } catch (error) {
    console.error("정책 데이터 요청 실패:", error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
      throw new Error(error.response.data.message || '서버에서 에러가 발생했습니다.');
    } else if (error.request) {
      throw new Error('서버에서 응답이 오지 않았습니다.');
    } else {
      throw new Error(error.message || '정책 목록을 불러오는데 실패했습니다.');
    }
  }
};

// 지역별 정책 조회 (POST)
export const getRegionPolicyList = async (page = 0, size = 10, do_ = "", city = "") => {
  try {
    console.log('Sending POST request with params:', { page, size, do_, city });
    const response = await publicAxios.post(`/policy/region`, {
      do_,
      city,
      page,
      size
    });
    console.log('POST API Response:', response);
    console.log('POST API Response Data:', response.data);
    console.log('POST API Response Data Structure:', {
      hasContent: !!response.data?.content,
      contentLength: response.data?.content?.length,
      totalElements: response.data?.totalElements,
      totalPages: response.data?.totalPages,
      number: response.data?.number
    });

    const responseData = response.data;
    if (responseData?.content) {
      return {
        content: responseData.content,
        totalElements: responseData.totalElements,
        totalPages: responseData.totalPages,
        currentPage: responseData.number + 1
      };
    } else {
      console.error('Invalid response structure:', responseData);
      throw new Error('응답 데이터가 올바르지 않습니다.');
    }
  } catch (error) {
    console.error("정책 데이터 요청 실패:", error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
      throw new Error(error.response.data.message || '서버에서 에러가 발생했습니다.');
    } else if (error.request) {
      throw new Error('서버에서 응답이 오지 않았습니다.');
    } else {
      throw new Error(error.message || '정책 목록을 불러오는데 실패했습니다.');
    }
  }
}; 