package com.backend.farmbti.crops.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CropsReportErrorCode implements ErrorCode {

    REPORT_NOT_FOUND(401, "리포트를 찾을 수 없습니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}
