package com.backend.farmbti.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

//2개의 토큰 dto
@Builder
@Getter
@AllArgsConstructor
public class Token {
    private String accessToken;
    private String refreshToken;
    private LocalDateTime accessTokenExpiresInForHour;

}
