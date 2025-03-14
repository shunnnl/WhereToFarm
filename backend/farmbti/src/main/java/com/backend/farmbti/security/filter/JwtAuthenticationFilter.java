package com.backend.farmbti.security.filter;

import com.backend.farmbti.security.jwt.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //1. 요청 헤더에서 JWT 토큰 추출
        String token = resolveToken(request);

        //2. 토큰이 유효한 경우 인증 정보 설정
        try {
            if (token != null && jwtTokenProvider.validateToken(token)) {
                //토큰에서 사용자 if, email,address 가져와서 Authentication 객체 생성
                Long userId = jwtTokenProvider.getUserId(token);
                String email = jwtTokenProvider.getEmail(token);
                String address = jwtTokenProvider.getAddress(token);


                // 사용자 권한 설정 (일반적으로 DB에서 가져오지만, 여기서는 간단히 구현)
                List<SimpleGrantedAuthority> authorities =
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

                // 사용자 인증 객체 생성 및 SecurityContext에 설정
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        email,                  // principal (보통 username이나 email)
                        null,                   // credentials (비밀번호, 보안을 위해 null로 설정)
                        authorities            // 권한 목록
                );

                // Spring Security의 SecurityContext에 인증 정보 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 추가 정보를 요청 속성에 저장하여 컨트롤러에서 사용할 수 있게 함
                request.setAttribute("userId", userId);
                request.setAttribute("userEmail", email);
                request.setAttribute("userAddress", address);
            }
        } catch (Exception e) {
            //토큰 검증 실패 처리 로직
            SecurityContextHolder.clearContext();
        }

        // 다음 필터로 요청 전달
        filterChain.doFilter(request, response);

    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
