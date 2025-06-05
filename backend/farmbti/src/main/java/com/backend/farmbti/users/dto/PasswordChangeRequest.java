package com.backend.farmbti.users.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordChangeRequest {
    private String currentPassword; // 현재 비밀번호
    private String newPassword; // 새 비밀번호
}