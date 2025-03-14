package com.backend.farmbti.security.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum JwtErrorCode implements ErrorCode {

    // 토큰 에러
    TOKEN_NOT_FOUND(401, "토큰을 찾을 수 없습니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}
