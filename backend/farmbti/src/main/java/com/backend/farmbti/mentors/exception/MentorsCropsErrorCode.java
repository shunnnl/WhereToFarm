package com.backend.farmbti.mentors.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MentorsCropsErrorCode implements ErrorCode {

    INVALID_CROP_NAME(400, "존재하지 않는 작물 이름이 포함되어 있습니다."),
    NO_CROPS_SELECTED(400, "최소 하나 이상의 작물을 선택해야 합니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}