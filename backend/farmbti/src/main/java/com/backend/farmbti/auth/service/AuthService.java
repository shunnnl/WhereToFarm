package com.backend.farmbti.auth.service;

import com.backend.farmbti.auth.dto.*;
import com.backend.farmbti.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public void singUp(SignUpRequest request) {

    }

    public LoginResponse login(LoginRequest request) {
    }

    public void logout() {
    }

    public void modify(ModifyRequest request) {
    }

    public void modifyProfile(ModifyProfileRequest request) {
    }

    public void modifyPassword(ModifyPasswordRequest request) {
    }
}
