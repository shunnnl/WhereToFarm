package com.backend.farmbti.security.jwt;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.security.dto.Token;
import com.backend.farmbti.security.exception.JwtErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.SignatureException;
import java.time.LocalDateTime;
import java.util.Date;

//JWT 토큰 생성, 검증, 파싱
//JWT properties의 속성들을 기반으로 토큰을 생성함
@Component
@Slf4j
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;
    private final UsersRepository usersRepository;

    /**
     * JWT 토큰 생성 메서드 (Access Token + Refresh Token)
     *
     * @param users 사용자 정보
     * @return 액세스 토큰과 리프레시 토큰을 포함한 Token 객체
     */
    //유저가 로그인 시에 user 객체만 넘겨주면 3개의 반환 타입을 넘겨준다.
    public Token generateToken(Users users) {
        // JwtProperties에서 만료 시간 가져오기
        long accessTokenExpiresIn = jwtProperties.getExpirationTime();
        long refreshTokenExpiresIn = jwtProperties.getRefreshExpirationTime();

        // 액세스 토큰 생성
        String accessToken = generateAccessToken(users, accessTokenExpiresIn);
        // 리프레시 토큰 생성
        String refreshToken = generateRefreshToken(users, refreshTokenExpiresIn);

        LocalDateTime now = LocalDateTime.now();

        //현재시간
        //액세스 토큰 만료일을 알아보기 쉽게 3600000 -> 1시간
        long accessTokenExpiresInHours = accessTokenExpiresIn / 3600000;
        LocalDateTime expirationTime = now.plusHours(accessTokenExpiresInHours);

        return new Token(accessToken, refreshToken, expirationTime);
    }

    /**
     * 서명에 사용할 키를 생성
     *
     * @return 서명용 Key 객체
     */
    private Key getSigningKey() {
        byte[] keyBytes = jwtProperties.getSecretKey().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 액세스 토큰 생성
     *
     * @param users          사용자 정보
     * @param expirationTime 만료 시간(밀리초)
     * @return 생성된 액세스 토큰
     */
    private String generateAccessToken(Users users, long expirationTime) {

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        log.info("만료 시간: " + expiryDate);

        return Jwts.builder()
                .setSubject(String.valueOf(users.getId()))
                .claim("id", users.getId())
                .claim("email", users.getEmail())
                .claim("name", users.getName())
                .claim("address", users.getAddress())
                .claim("tokenType", "access") // 토큰 타입 표시
                .setIssuedAt(now) // 발행 시간
                .setExpiration(expiryDate) // 만료 시간
                .setIssuer(jwtProperties.getIssuer()) // 발행자
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // 서명 알고리즘
                .compact();
    }

    public Token refreshAccessToken(String refreshToken) throws SignatureException {
        if (!validateToken(refreshToken)) {
            throw new GlobalException(JwtErrorCode.TOKEN_NOT_FOUND);
        }
        Claims claims = getClaims(refreshToken);

        String tokenType = claims.get("tokenType", String.class);

        if (!"refresh".equals(tokenType)) {
            throw new GlobalException(JwtErrorCode.TOKEN_NOT_VALID);
        }

        // 4. 사용자 ID 추출
        Long userId = Long.parseLong(claims.getSubject());

        // 5. 사용자 조회 (서비스나 레포지토리 주입 필요)
        Users users = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 6. 저장된 리프레시 토큰과 일치하는지 확인
        if (!refreshToken.equals(users.getRefreshToken())) {
            throw new GlobalException(JwtErrorCode.REFRESH_NOT_VALID);
        }

        // 7. 새 액세스 토큰 생성
        return generateToken(users);

    }


    /**
     * 리프레시 토큰 생성 (최소한의 정보만 포함)
     *
     * @param users          사용자 정보
     * @param expirationTime 만료 시간(밀리초)
     * @return 생성된 리프레시 토큰
     */
    private String generateRefreshToken(Users users, long expirationTime) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setSubject(String.valueOf(users.getId()))
                .claim("tokenType", "refresh") // 토큰 타입 표시
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .setIssuer(jwtProperties.getIssuer())
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 토큰 검증 및 클레임 추출
     *
     * @param token JWT 토큰
     * @return 토큰의 클레임(페이로드) 정보
     * @throws Exception 토큰이 유효하지 않을 경우 예외 발생
     */
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 토큰 유효성 검사
     *
     * @param token 검증할 토큰
     * @return 유효하면 true, 그렇지 않으면 false
     */
    public boolean validateToken(String token) throws SignatureException {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            log.error("유효하지 않은 JWT 토큰: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT 토큰 만료: {}", e.getMessage());
        }

        return false;
    }

    /**
     * 토큰에서 사용자 ID 추출 (claim)
     *
     * @param token JWT 토큰
     * @return 사용자 ID (Long 타입)
     */
    public Long getUserId(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.get("id", Long.class);
        } catch (Exception e) {
            log.error("토큰에서 userId 추출 오류: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 토큰에서 사용자 이메일 추출
     *
     * @param token JWT 토큰
     * @return 사용자 이메일
     */
    public String getEmail(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.get("email", String.class);
        } catch (Exception e) {
            log.error("토큰에서 email 추출 오류: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 토큰에서 사용자 주소 추출
     *
     * @param token JWT 토큰
     * @return 사용자 주소
     */
    public String getAddress(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.get("address", String.class);
        } catch (Exception e) {
            log.error("토큰에서 address 추출 오류: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 토큰에서 사용자 주소 추출
     *
     * @param token JWT 토큰
     * @return 사용자 주소
     */
    public String getName(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.get("name", String.class);
        } catch (Exception e) {
            log.error("토큰에서 address 추출 오류: {}", e.getMessage());
            return null;
        }
    }


}
