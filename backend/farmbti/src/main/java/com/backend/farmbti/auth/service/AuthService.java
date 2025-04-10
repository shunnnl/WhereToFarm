package com.backend.farmbti.auth.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.dto.LoginRequest;
import com.backend.farmbti.auth.dto.LoginResponse;
import com.backend.farmbti.auth.dto.SignUpRequest;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.common.service.S3Service;
import com.backend.farmbti.mentors.repository.MentorsRepository;
import com.backend.farmbti.redis.RedisKey;
import com.backend.farmbti.security.dto.Token;
import com.backend.farmbti.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final S3Service s3Service;
    private final MentorsRepository mentorsRepository;
    private final RedisKey redisKey;

    public void signUp(SignUpRequest request) {
        //1. 에러 검증
        validateSignupRequest(request);

        //2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 성별에 따른 기본 프로필 이미지 키 설정
        String profileImageKey = s3Service.getDefaultProfileImageKey(request.getGender());

        //3. User 엔터티 생성
        Users users = Users.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .birth(request.getBirth())
                .address(request.getAddress())
                .gender(request.getGender())
                .profileImage(profileImageKey)
                .build();

        //4. db에 저장
        usersRepository.save(users);

        //5. URL 생성 및 저장 (DB에 저장한 후 ID가 필요하여 save 이후에 실행)
        try {
            String profileImageUrl = s3Service.getOrCreateSignedUrl(users);
            users.updateProfileImageUrl(profileImageUrl, LocalDateTime.now().plusDays(6));
            usersRepository.save(users);
        } catch (Exception e) {

        }

        log.info("회원가입 완료");
    }

    private void validateSignupRequest(SignUpRequest request) {
        List<Users> existingUsers = usersRepository.findAllByEmail(request.getEmail());

        // isOut = 0인 유저가 있는지 확인
        boolean hasActiveUser = existingUsers.stream()
                .anyMatch(user -> user.getIsOut().equals((byte) 0));

        if (hasActiveUser) {
            throw new GlobalException(AuthErrorCode.EMAIL_INVALID);
        }
    }


    public LoginResponse login(LoginRequest request) {
        //1. 이메일 검증
        Users users = usersRepository.findByEmailAndIsOut(request.getEmail(), (byte) 0)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.EMAIL_NOT_FOUND));


        //2. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), users.getPassword())) {
            log.warn("비밀번호 불일치", users.getPassword());
            throw new GlobalException(AuthErrorCode.INVALID_PASSWORD);
        }

        // ✅ 동시 로그인 방지 체크
        String redisLoginKey = redisKey.getLoginTokenKey(users.getId());
        String storedToken = (String) redisKey.redisTemplate().opsForValue().get(redisLoginKey);

        if (storedToken != null) {
            log.warn("[AuthService] 이미 로그인된 사용자 - userId: {}", users.getId());
            throw new GlobalException(AuthErrorCode.ALREADY_LOGGED_IN); // ✅ 새로 정의 필요
        }

        log.info("로그인 성공", users.getEmail());

        // 3. JWT 토큰 생성
        Token token = jwtTokenProvider.generateToken(users);

        // Redis에 access token 저장 (동시 로그인 방지용)
        redisKey.redisTemplate().opsForValue().set(
            redisLoginKey,
            token.getAccessToken(),
            jwtTokenProvider.getAccessTokenValidity(),
            TimeUnit.MILLISECONDS
        );

        // 4. 멘토 여부 확인
        boolean isMentor = mentorsRepository.findByUserId(users.getId()).isPresent();
        log.info("멘토 여부 확인: {}", isMentor);

        return LoginResponse.builder()
                .id(users.getId())
                .email(users.getEmail())
                .name(users.getName())
                .address(users.getAddress())
                .gender(users.getGender())
                .birth(users.getBirth())
                .profileImage(users.getProfileImage())
                .token(token)
                .createdAt(users.getCreatedAt())
                .isOut(users.getIsOut()) // 탈퇴여부
                .isMentor(isMentor) // 멘토 여부 추가
                .build();
    }

    public void logout(Long id) {
        Users users = usersRepository.findById(id)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 🔥 Redis 토큰 삭제
        String redisLoginKey = redisKey.getLoginTokenKey(users.getId());
        redisKey.redisTemplate().delete(redisLoginKey);
        log.info("Redis 로그인 토큰 삭제 완료: {}", redisLoginKey);

        invalidateRefreshToken(users);
        log.info("로그아웃 완료", users.getEmail());
    }

    private void invalidateRefreshToken(Users users) {
        // 사용자의 리프레시 토큰 필드를 null로 설정
        users.updateRefreshToken(null);
        usersRepository.save(users);
    }

}
