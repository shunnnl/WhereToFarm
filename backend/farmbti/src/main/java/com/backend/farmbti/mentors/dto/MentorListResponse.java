package com.backend.farmbti.mentors.dto;

import lombok.*;
import java.util.List;
import java.util.Date;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorListResponse {
    // 유저 정보
    private Long userId;
    private String email;
    private String name;
    private String address;
    private Date birth;
    private Byte gender;
    private String profileImage;

    // 멘토 정보
    private Long mentorId;
    private String bio;
    private Integer farmingYears;
    private List<String> cropNames;
}