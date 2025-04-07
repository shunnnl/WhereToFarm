package com.backend.farmbti.users.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UsersErrorCode implements ErrorCode {

    // 비밀번호 변경 관련 에러 코드
    PASSWORD_MISMATCH(400, "현재 비밀번호가 일치하지 않습니다."),
    NEW_PASSWORD_SAME_AS_CURRENT(400, "새 비밀번호가 현재 비밀번호와 동일합니다."),
    PASSWORD_TOO_SHORT(400, "비밀번호는 최소 8자 이상이어야 합니다."),
    PASSWORD_REQUIRES_DIGIT(400, "비밀번호에는 최소 하나 이상의 숫자가 포함되어야 합니다."),
    PASSWORD_REQUIRES_LETTER(400, "비밀번호에는 최소 하나 이상의 영문자가 포함되어야 합니다."),

    // 회원 탈퇴 관련 에러 코드
    ALREADY_DELETED_USER(400, "이미 탈퇴한 회원입니다."),

    // 회원 정보 수정 관련 에러 코드
    INVALID_BIRTH_DATE_FUTURE(400, "생년월일은 미래 날짜가 될 수 없습니다."),
    USER_NAME_TOO_LONG(400, "이름은 20자 이하여야 합니다."),
    ADDRESS_CONTAINS_ENGLISH(400, "주소는 한글과 숫자만 입력 가능합니다."),

    // 필수 입력값 관련 에러 코드
    INVALID_USER_NAME(400, "이름은 필수입니다."),
    INVALID_USER_ADDRESS(400, "주소는 필수입니다."),
    INVALID_USER_BIRTH(400, "생년월일은 필수입니다."),
    INVALID_USER_GENDER(400, "성별은 필수입니다."),

    // 현재 로그인 사용자 정보 조회 관련 에러 코드
    PROFILE_IMAGE_URL_GENERATION_FAILED(500, "프로필 이미지 URL 생성에 실패했습니다.");

    // 기본 이미지 업로드 관련 에러 코드
    // 사용자 이미지 업로드 관련 에러 코드

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}