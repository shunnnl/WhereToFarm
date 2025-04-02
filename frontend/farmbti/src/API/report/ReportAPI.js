import { authAxios } from '../common/AxiosInstance';

// FARM 점수로 리포트 생성 요청
export const createReport = async (farmScores) => {
  try {
    const response = await authAxios.post('/report/create', {
      params: {
        F: farmScores.F,
        A: farmScores.A,
        R: farmScores.R,
        M: farmScores.M
      }
    });
    console.log('Report API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Report 생성 실패:', error.response?.data || error);
    throw error;
  }
}; 