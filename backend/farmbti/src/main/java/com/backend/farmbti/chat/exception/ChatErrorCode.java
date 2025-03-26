package com.backend.farmbti.chat.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ChatErrorCode implements ErrorCode {

    CHAT_ROOM_NOT_FOUND(401, "채팅방을 찾을 수 없습니다."),
    CHAT_ROOM_NOT_EXISTS(404, "존재하는 채팅방이 없습니다."),
    SELF_MENTORING_NOT_ALLOWED(400, "멘토와 멘티는 같은 사람일 수 없습니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}
