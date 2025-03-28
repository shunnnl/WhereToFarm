package com.backend.farmbti.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UploadProfileImageResponse {
    private String imageUrl;
}
