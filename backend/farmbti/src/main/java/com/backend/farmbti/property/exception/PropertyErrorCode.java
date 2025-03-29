package com.backend.farmbti.property.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PropertyErrorCode implements ErrorCode {

    PROPERTY_NOT_FOUND(404, "해당 매물을 찾을 수 없습니다."),
    INVALID_SEARCH_CRITERIA(400, "잘못된 검색 조건입니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}