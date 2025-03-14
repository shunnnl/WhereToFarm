package com.backend.farmbti.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;

//2개의 토큰 dto
@Builder
@AllArgsConstructor
public class Token {
    private String accessToken;
    private String refreshToken;
    private long accessTokenExpiresIn;

}
