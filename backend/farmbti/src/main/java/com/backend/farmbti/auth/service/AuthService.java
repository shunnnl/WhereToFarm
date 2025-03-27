package com.backend.farmbti.auth.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.dto.LoginRequest;
import com.backend.farmbti.auth.dto.LoginResponse;
import com.backend.farmbti.auth.dto.SignUpRequest;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.common.service.S3Service;
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

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final S3Service s3Service;

    public void signUp(SignUpRequest request) {
        //1. 에러 검증
        validateSignupRequest(request);

        //2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        //3. 성별에 따른 기본 프로필 이미지 URL 설정
        String defaultProfileImage = s3Service.getDefaultProfileImageUrl(request.getGender());

        //3. User 엔터티 생성
        Users users = Users.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .birth(request.getBirth())
                .address(request.getAddress())
                .gender(request.getGender())
                .profileImage(defaultProfileImage)
                .build();

        //4. db에 저장
        usersRepository.save(users);

        log.info("회원가입 완료");
        log.info("회원가입 완료: 기본 프로필 이미지 설정 - {}", defaultProfileImage);
    }

    private void validateSignupRequest(SignUpRequest request) {
        //이미 등록된 이메일인 경우 에러
        if (usersRepository.existsByEmail(request.getEmail())) {
            throw new GlobalException(AuthErrorCode.EMAIL_INVALID);
        }
    }

    public LoginResponse login(LoginRequest request) {

        //1. 이메일 검증
        Users users = usersRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new GlobalException(AuthErrorCode.EMAIL_NOT_FOUND));

        //2. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), users.getPassword())) {
            log.warn("비밀번호 불일치", users.getPassword());
            throw new GlobalException(AuthErrorCode.INVALID_PASSWORD);
        }

        log.info("로그인 성공", users.getEmail());

        // 3. JWT 토큰 생성
        Token token = jwtTokenProvider.generateToken(users);

        return LoginResponse.builder()
                .id(users.getId())
                .email(users.getEmail())
                .name(users.getName())
                .address(users.getAddress())
                .gender(users.getGender())
                .birth(users.getBirth())
                .profileImage(users.getProfileImage())
                .token(token)
                .build();
    }

    public void logout(Long id) {
        Users users = usersRepository.findById(id)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        invalidateRefreshToken(users);
        log.info("로그아웃 완료", users.getEmail());
    }

    private void invalidateRefreshToken(Users users) {
        // 사용자의 리프레시 토큰 필드를 null로 설정
        users.updateRefreshToken(null);
        usersRepository.save(users);
    }

}
