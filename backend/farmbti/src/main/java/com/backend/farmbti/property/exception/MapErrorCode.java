package com.backend.farmbti.property.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MapErrorCode implements ErrorCode {

    ADDRESS_NOT_FOUND(404, "주소에 대한 좌표 정보를 찾을 수 없습니다."),
    COORDINATE_PARSING_ERROR(400, "좌표 정보 파싱 중 오류가 발생했습니다."),
    KAKAO_API_ERROR(500, "카카오 지도 API 호출 중 오류가 발생했습니다."),
    INVALID_ADDRESS_FORMAT(400, "유효하지 않은 주소 형식입니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}