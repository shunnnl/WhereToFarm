package com.backend.farmbti.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum S3ErrorCode implements ErrorCode {

    PROFILE_IMAGE_URL_GENERATION_FAILED(500, "프로필 이미지 URL 생성에 실패했습니다."),
    PROFILE_IMAGE_UPLOAD_FAILED(500, "프로필 이미지 업로드에 실패했습니다."),
    FILE_NOT_PROVIDED(400, "업로드할 파일이 제공되지 않았습니다."),
    FILE_SIZE_EXCEEDED(400, "파일 크기가 허용된 최대값을 초과합니다."),
    UNSUPPORTED_FILE_TYPE(400, "지원하지 않는 파일 형식입니다."),
    IMAGE_DELETE_FAILED(500, "이미지 삭제에 실패했습니다."),
    S3_SERVICE_ERROR(500, "S3 서비스 접근 중 오류가 발생했습니다."),
    DEFAULT_PROFILE_IMAGE_NOT_FOUND(404, "성별에 맞는 기본 프로필 이미지를 찾을 수 없습니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}