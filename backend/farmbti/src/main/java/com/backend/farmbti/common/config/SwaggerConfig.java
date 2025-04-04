package com.backend.farmbti.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
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

        return new OpenAPI()
                .components(new Components().addSecuritySchemes("bearerAuth", jwtScheme))
                .security(java.util.List.of(securityRequirement))
                .info(new Info()
                        .title("FarmBTI API")
                        .description("FarmBTI 서비스의 API 문서")
                        .version("1.0.0"));
        // .servers(List.of(new Server().url("https://j12d209.p.ssafy.io/api"))); // api 붙어야함!
    }
}