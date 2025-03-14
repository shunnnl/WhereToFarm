package com.backend.farmbti.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SignUpRequest {

    private String email;
    private String password;
    private String name;
    private String address;
    private Byte gender;
    private LocalDate birth;
    private String profileImage;

}
