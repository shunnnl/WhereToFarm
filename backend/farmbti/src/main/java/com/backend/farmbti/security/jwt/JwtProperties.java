package com.backend.farmbti.security.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt") //yml에서 jwt: 로 설정값들을 추가해줄 수 있다.
@Getter
@Setter
public class JwtProperties {
    // JWT 시크릿 키 (서명에 사용)
    private String secretKey;

    // 토큰 유효 시간 (밀리초)
    private long expirationTime;

    // 토큰 접두사 (일반적으로 "Bearer ")
    private String tokenPrefix;

    // 인증 헤더 이름 (일반적으로 "Authorization")
    private String headerString;

    // 토큰 발행자 (issuer)
    private String issuer;

    // 토큰 갱신 관련 설정
    private long refreshExpirationTime;

}
