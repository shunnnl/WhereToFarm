package com.backend.farmbti.chat.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChatResponse {
    private Long roomId;
    private Long currentUserId;
    private Long otherUserId;
    private String currentUserName;
    private String otherUserName;
    private String otherUserProfile;
    private boolean isCurrentUserMentee;  // 현재 사용자가 멘티인지 여부
}
