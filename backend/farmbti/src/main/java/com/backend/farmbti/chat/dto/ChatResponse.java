package com.backend.farmbti.chat.dto;

import lombok.Builder;

@Builder
public class ChatResponse {

    private Long roomId;
    private Long menteeId;
    private Long mentorId;
    private String menteeName;
    private String mentorName;
    private String mentorProfile;

}
