package com.backend.farmbti.auth.dto;

import lombok.Data;
import lombok.Getter;

@Getter
@Data
public class RefreshTokenRequest {
    String refreshToken;
}
