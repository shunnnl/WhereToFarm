package com.backend.farmbti.zeppelin.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ZeppelinErrorCode implements ErrorCode {

    NOTEBOOK_NOT_FOUND(404, "노트북을 찾을 수 없습니다."),
    PARAGRAPH_NOT_FOUND(404, "단락을 찾을 수 없습니다."),
    EXECUTION_FAILED(500, "노트북 실행에 실패했습니다."),
    TIMEOUT(504, "노트북 실행 시간이 초과되었습니다."),
    INVALID_PARAMETER(400, "잘못된 파라미터입니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}