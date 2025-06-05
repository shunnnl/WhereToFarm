package com.backend.farmbti.auth.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AuthErrorCode implements ErrorCode {


    // 회원가입 에러
    EMAIL_INVALID(400, "이미 사용중인 이메일 형식입니다"),
    EMAIL_NOT_FOUND(401, "등록되지 않은 이메일입니다."),
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    INVALID_PASSWORD(402, "비밀번호가 일치하지 않습니다"),
    ALREADY_LOGGED_IN(409, "이미 로그인된 사용자입니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}
