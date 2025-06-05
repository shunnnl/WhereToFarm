package com.backend.farmbti.chat.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class ChatListResponse {
    private Long roomId;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserProfile;
    private String lastMessage;
    private LocalDateTime lastMessageTime; // 정렬에 사용할 시간 정보
    private boolean isRead;
}
