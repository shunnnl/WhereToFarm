package com.backend.farmbti.security.dto;

import lombok.AllArgsConstructor;

//2개의 토큰 dto
@AllArgsConstructor
public class Token {
    private String accessToken;
    private String refreshToken;
    private long accessTokenExpiresIn;

}
