package com.backend.farmbti.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openApi() {
        // JWT 스키마 정의
        SecurityScheme jwtScheme = new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .in(SecurityScheme.In.HEADER)
            .name("Authorization");

        // API 보안 요구사항 추가
        SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

        // 기본 서버 URL 설정 - 여기서 접두사를 제거하거나 변경할 수 있습니다
        // Server server = new Server()
        //     .url("/")  // 기본 경로를 "/"로 설정하여 접두사 제거
        //     .description("Default Server URL");

        return new OpenAPI()
            .components(new Components().addSecuritySchemes("bearerAuth", jwtScheme))
            .security(java.util.List.of(securityRequirement))
            //.servers(java.util.List.of(server))  // 서버 설정 추가
            .info(new Info()
                .title("FarmBTI API")
                .description("FarmBTI 서비스의 API 문서")
                .version("1.0.0"));
    }
}