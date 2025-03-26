package com.backend.farmbti.users.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CurrentUserResponse {
    private String email;
    private String name;
    private String address;
    private Date birth;
    private Byte gender;
    private String profileImage;
}