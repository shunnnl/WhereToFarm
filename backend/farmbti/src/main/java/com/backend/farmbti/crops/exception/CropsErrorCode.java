package com.backend.farmbti.crops.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CropsErrorCode implements ErrorCode {

    CROPS_NOT_FOUND(401, "농산물을 찾을 수 없습니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }

}
