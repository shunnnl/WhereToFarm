package com.backend.farmbti.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openApi() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("FarmBTI API")
                        .description("FarmBTI 서비스의 API 문서")
                        .version("1.0.0"));
    }
}