package com.backend.farmbti.users.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UsersErrorCode implements ErrorCode {

    PASSWORD_MISMATCH(400, "현재 비밀번호가 일치하지 않습니다.");

    private final int status;
    private final String message;
    @Override
    public String code() {
        return name();
    }
}