package com.backend.farmbti.chat.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChatListResponse {
    private Long roomId;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserProfile;
    private String lastMessage;
}
