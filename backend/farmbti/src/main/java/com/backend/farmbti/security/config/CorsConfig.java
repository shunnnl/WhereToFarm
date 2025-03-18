package com.backend.farmbti.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 오리진(프론트엔드 도메인) 설정
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",    // 로컬 개발 환경
                "http://j12d209.p.ssafy.io:8080"
        ));

        // 허용할 HTTP 메서드 설정
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // 허용할 헤더 설정
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization", "Cache-Control", "Content-Type"
        ));

        // 인증 정보(쿠키 등) 허용 설정
        configuration.setAllowCredentials(true);

        // 브라우저가 응답을 캐싱할 수 있는 시간(초)
        configuration.setMaxAge(3600L);

        // 모든 URL 패턴에 이 CORS 설정 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
