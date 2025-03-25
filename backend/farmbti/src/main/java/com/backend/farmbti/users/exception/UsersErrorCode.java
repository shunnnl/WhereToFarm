package com.backend.farmbti.users.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UsersErrorCode implements ErrorCode {

    PASSWORD_MISMATCH(400, "현재 비밀번호가 일치하지 않습니다."),
    INVALID_USER_NAME(400, "이름은 필수입니다."),
    INVALID_USER_ADDRESS(400, "주소는 필수입니다."),
    INVALID_USER_BIRTH(400, "생년월일은 필수입니다."),
    INVALID_USER_GENDER(400, "성별은 필수입니다.");

    private final int status;
    private final String message;
    @Override
    public String code() {
        return name();
    }
}