package com.backend.farmbti.chat.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class MessageRequest {
    private String message;
    private String senderName;
    private Long senderId;
    private String senderProfile;
    private boolean active; // 사용자의 채팅방 활성 상태
}
