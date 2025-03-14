package com.backend.farmbti.auth.dto;

import com.backend.farmbti.security.dto.Token;
import lombok.Builder;

import java.util.Date;

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
}
