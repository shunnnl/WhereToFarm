package com.backend.farmbti.auth.service;

import com.backend.farmbti.auth.domain.User;
import com.backend.farmbti.auth.dto.*;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UserRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.security.dto.Token;
import com.backend.farmbti.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public void singUp(SignUpRequest request) {
        //1. 에러 검증
        validateSignupRequest(request);

        //2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        //3. User 엔터티 생성
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .birth(request.getBirth())
                .address(request.getAddress())
                .gender(request.getGender())
                .profileImage("")
                .build();

        //4. db에 저장
        userRepository.save(user);

        log.info("회원가입 완료");
    }

    private void validateSignupRequest(SignUpRequest request) {
        //이미 등록된 이메일인 경우 에러
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new GlobalException(AuthErrorCode.EMAIL_INVALID);
        }
    }

    public LoginResponse login(LoginRequest request) {

        //1. 이메일 검증
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        //2. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("비밀번호 불일치", user.getPassword());
            throw new GlobalException(AuthErrorCode.INVALID_PASSWORD);
        }

        log.info("로그인 성공", user.getEmail());

        // 3. JWT 토큰 생성
        Token token = jwtTokenProvider.generateToken(user);

        return LoginResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .address(user.getAddress())
                .gender(user.getGender())
                .birth(user.getBirth())
                .profileImage(user.getProfileImage())
                .token(token)
                .build();
    }

    public void logout(Long id) {

    }

    public void modify(ModifyRequest request) {
    }

    public void modifyProfile(ModifyProfileRequest request) {
    }

    public void modifyPassword(ModifyPasswordRequest request) {
    }
}
