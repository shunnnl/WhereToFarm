package com.backend.farmbti.users.dto;

import java.util.Date;
import java.util.List;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrentUserResponse {
    private Long userId;
    private String email;
    private String name;
    private String address;
    private Date birth;
    private Byte gender;
    private String profileImage;

    @Builder.Default
    private Boolean isMentor = false;

    private Boolean isDefaultImage;

    // 멘토 정보
    private Long mentorId;
    private String bio;
    private Integer farmingYears;
    private List<String> cropNames;
}