package com.backend.farmbti.report.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportErrorCode implements ErrorCode {

    EMPTY_RESULT(400, "결과가 비어있습니다."),
    REGION_NOT_FOUND(404, "해당 지역을 찾을 수 없습니다."),
    CHARACTER_TYPE_NOT_FOUND(404, "해당 성격 유형을 찾을 수 없습니다."),
    REPORT_NOT_FOUND(404, "해당 리포트를 찾을 수 없습니다."),
    REPORT_CREATION_FAILED(500, "리포트 생성에 실패했습니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}