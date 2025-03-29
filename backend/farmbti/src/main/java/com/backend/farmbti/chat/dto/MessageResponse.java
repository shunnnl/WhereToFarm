package com.backend.farmbti.chat.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MessageResponse {
    private Long senderId;          //발신자
    private Long messageId;       // 메시지 고유 ID
    private String content;       // 메시지 내용
    private LocalDateTime sentAt; // 전송 시간
}
