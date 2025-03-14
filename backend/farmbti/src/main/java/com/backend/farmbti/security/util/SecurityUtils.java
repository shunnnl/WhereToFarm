package com.backend.farmbti.security.util;

import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.security.exception.JwtErrorCode;
import com.backend.farmbti.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
//컨트롤러에서 편하게 사용하기 위한 도구
public class SecurityUtils {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 현재 인증된 사용자의 ID를 가져옴
     *
     * @return 사용자 ID (인증 정보가 없을 경우 null)
     */
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new GlobalException(JwtErrorCode.TOKEN_NOT_FOUND);
        }

        try {
            String token = extractToken(authentication);
            return jwtTokenProvider.getUserId(token);
        } catch (Exception e) {
            log.warn("토큰에서 userId를 추출할 수 없습니다.");
            return null;
        }
    }

    /**
     * 현재 인증된 사용자의 이메일을 가져옴
     *
     * @return 사용자 이메일 (인증 정보가 없을 경우 null)
     */
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new GlobalException(JwtErrorCode.TOKEN_NOT_FOUND);
        }

        try {
            String token = extractToken(authentication);
            return jwtTokenProvider.getEmail(token);
        } catch (Exception e) {
            log.warn("토큰에서 이메일을 추출할 수 없습니다.");
            return null;
        }
    }

    /**
     * 현재 인증된 사용자의 주소를 가져옴
     *
     * @return 사용자 주소 (인증 정보가 없을 경우 null)
     */
    public String getCurrentUserAddress() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new GlobalException(JwtErrorCode.TOKEN_NOT_FOUND);
        }

        try {
            String token = extractToken(authentication);
            return jwtTokenProvider.getAddress(token);
        } catch (Exception e) {
            log.warn("토큰에서 주소를 추출할 수 없습니다.");
            return null;
        }
    }

    /**
     * 인증 여부 확인
     *
     * @return 인증된 사용자이면 true, 그렇지 않으면 false
     */
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }

    /**
     * Authentication 객체에서 JWT 토큰 추출
     *
     * @param authentication Spring Security Authentication 객체
     * @return JWT 토큰 문자열
     * @throws IllegalArgumentException 토큰이 없을 경우 예외 발생
     */
    private String extractToken(Authentication authentication) {
        Object credentials = authentication.getCredentials();

        if (credentials == null) {
            throw new IllegalArgumentException("토큰 안에서 추출할 수 있는 정보가 없습니다");
        }

        return credentials.toString();
    }

}
