package com.backend.farmbti.security.config;

import com.backend.farmbti.security.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

//스프링 부트가 실행될 때 이 설정을 읽어서 보안 설정을 적용
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    //패스워드 암호화
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 보안 필터 체인을 설정하는 Bean
     *
     * @param http HttpSecurity 객체 (스프링이 자동으로 주입)
     * @return 구성된 SecurityFilterChain 객체
     * @throws Exception 보안 설정 중 에러 발생 시 예외 처리
     *                   HttpSecurity 객체를 통해 보안 설정을 구성하고, 최종적으로 SecurityFilterChain을 반환
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF(Cross-Site Request Forgery) 보호 기능
                // CSRF 보호 기능 비활성화 (REST API에서는 일반적으로 비활성화)
                .csrf(csrf -> csrf.disable())  // CSRF 비활성화

                // CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                .formLogin(AbstractHttpConfigurer::disable) // 폼 로그인 비활성화
                .httpBasic(AbstractHttpConfigurer::disable)  // 기본 인증도 비활성화
                //JWT 필터 클래스를 쓰려면 생성자 주입이 필요하다.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                // 요청 권한 설정
                // 모든 HTTP 요청(.anyRequest())에 대해 인증(.authenticated())이 필요하다고 설정
                // 즉, 로그인 안 하면 어떤 페이지도 접근 불가능하게 만듦
                // URL 별 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(SecurityPath.getAllPublicPaths()).permitAll()
                    .anyRequest().authenticated()
                );
        // 최종적으로 구성된 보안 필터 체인을 빌드해서 반환해요
        // 이제 모든 HTTP 요청은 이 필터 체인을 통과
        return http.build();
    }
}
