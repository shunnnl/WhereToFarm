package com.backend.farmbti.security.filter;

import com.backend.farmbti.security.config.SecurityPath;
import com.backend.farmbti.security.jwt.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

// JwtTokenProvider를 사용해 추출한 JWT 토큰을 검증하고 인증 정보를 설정하는 핵심 역할
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String uri = request.getRequestURI();

        // ✅ Swagger 관련 요청은 필터링에서 제외 (JWT 인증 무시)
        log.info("🩵🩵Swagger 관련 요청은 필터링에서 제외🩵🩵");
        if (uri.startsWith("/v3/api-docs") ||
            uri.startsWith("/swagger-ui") ||
            uri.startsWith("/swagger-resources") ||
            uri.startsWith("/webjars") ||
            uri.startsWith("/configuration")) {
            log.info("[JwtAuthenticationFilter] Swagger 경로 요청 - 필터 제외: {}", uri);
            filterChain.doFilter(request, response);
            return;
        }

        String method = request.getMethod();
        log.info("[JwtAuthenticationFilter] 요청 시작: {} {}", method, uri);

        //1. 요청 헤더에서 JWT 토큰 추출
        String token = resolveToken(request);
        log.info("[JwtAuthenticationFilter] 토큰 추출 결과: {}", token != null ? "토큰 있음" : "토큰 없음");

        // SecurityPath 매칭 확인
        boolean isPermitEndpoint = isPermitAllEndpoint(uri);
        log.info("[JwtAuthenticationFilter] 허용된 경로 여부: {}, 경로: {}", isPermitEndpoint, uri);

        // permitAll 경로이면서 토큰이 없는 경우 -> 그냥 통과
        if (isPermitEndpoint && token == null) {
            log.info("[JwtAuthenticationFilter] 허용된 경로이며 토큰이 없음 - 필터 통과");
            filterChain.doFilter(request, response);
            return;
        }

        // 추가된 부분: 인증이 필요한 경로에 토큰이 없는 경우 오류 응답 반환
        if (!isPermitEndpoint && token == null) {
            log.warn("[JwtAuthenticationFilter] 보호된 경로에 토큰 없음: {}", uri);
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 상태 코드

            String jsonResponse = "{\"success\":false,\"data\":null,\"error\":{\"code\":\"TOKEN_NOT_FOUND\",\"message\":\"인증 토큰이 필요합니다\",\"status\":401}}";
            response.getWriter().write(jsonResponse);
            return; // 여기서 필터 체인 종료
        }


        //2. 토큰이 유효한 경우 인증 정보 설정
        try {
            if (token != null && jwtTokenProvider.validateToken(token)) {
                log.info("[JwtAuthenticationFilter] 토큰 유효성 검증 성공");

                //토큰에서 사용자 id, email, address 가져와서 Authentication 객체 생성
                Long userId = jwtTokenProvider.getUserId(token);
                String email = jwtTokenProvider.getEmail(token);
                String address = jwtTokenProvider.getAddress(token);
                log.info("[JwtAuthenticationFilter] 토큰에서 추출한 정보 - userId: {}, email: {}", userId, email);

                // 사용자 권한 설정 (일반적으로 DB에서 가져오지만, 여기서는 간단히 구현)
                List<SimpleGrantedAuthority> authorities =
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

                // 사용자 인증 객체 생성 및 SecurityContext에 설정
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        email,                  // principal (보통 username이나 email)
                        token,                   // securityUtil에서 추출힘
                        authorities            // 권한 목록
                );

                // Spring Security의 SecurityContext에 인증 정보 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("[JwtAuthenticationFilter] 인증 정보 설정 완료");

                // 추가 정보를 요청 속성에 저장하여 컨트롤러에서 사용할 수 있게 함
                request.setAttribute("userId", userId);
                request.setAttribute("userEmail", email);
                request.setAttribute("userAddress", address);
            } else if (token != null) {
                log.warn("[JwtAuthenticationFilter] 토큰 유효성 검증 실패: {}", token);
            }
        } catch (Exception e) {
            //토큰 검증 실패 처리 로직
            log.error("[JwtAuthenticationFilter] 토큰 처리 중 예외 발생: {}", e.getMessage(), e);
            SecurityContextHolder.clearContext();
        }

        // 다음 필터로 요청 전달
        log.info("[JwtAuthenticationFilter] 다음 필터로 요청 전달");
        filterChain.doFilter(request, response);
        log.info("[JwtAuthenticationFilter] 필터 체인 처리 완료: {} {}", method, uri);
    }

    //사용자 정의 path 통과
    private boolean isPermitAllEndpoint(String uri) {
        boolean matches = SecurityPath.matches(uri);
        log.debug("[JwtAuthenticationFilter] SecurityPath.matches 결과: {}, URI: {}", matches, uri);
        return matches;
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        log.debug("[JwtAuthenticationFilter] Authorization 헤더: {}", bearerToken);

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            log.debug("[JwtAuthenticationFilter] 추출된 토큰: {}", token);
            return token;
        }
        return null;
    }
}