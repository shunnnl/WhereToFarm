package com.backend.farmbti.auth.dto;

import com.backend.farmbti.security.dto.Token;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Builder
public class LoginResponse {
    private Long id;
    private String email;
    private String name;
    private String address;
    private Byte gender;
    private Date birth;
    private String profileImage;
    private Token token;
    private LocalDateTime createdAt;
    private Byte isOut; // 탈퇴여부
}
