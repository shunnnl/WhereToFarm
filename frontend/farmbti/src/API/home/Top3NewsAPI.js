import { publicAxios } from "../common/AxiosInstance"

export const getTop3News = async () => {
    try {
        const response = await publicAxios.get("/news/main");
        
        // 응답 데이터 로깅
        console.log("API 응답 데이터:", response.data);
        
        // 응답이 배열인지 확인
        if (!Array.isArray(response.data)) {
            throw new Error("올바르지 않은 응답 형식입니다.");
        }

        return response.data;
    } catch (error) {
        console.error("Top3 뉴스 요청 오류:", error);
        throw new Error(error.message || "뉴스를 불러오는데 실패했습니다.");
    }
}