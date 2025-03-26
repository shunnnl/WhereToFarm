package com.backend.farmbti.chat.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChatListResponse {
    private String mentorName;
    private String mentorProfile;
    private String lastMessage;
}
