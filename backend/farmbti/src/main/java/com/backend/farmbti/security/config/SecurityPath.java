package com.backend.farmbti.security.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@AllArgsConstructor
public enum SecurityPath {

    //test 경로
    API_TEST("/actuator/**"),

    //Swagger 관련 경로
    SWAGGER_UI("/swagger-ui/**"),
    //SWAGGER_API_DOCS("/v3/api-docs"),
    SWAGGER_API_DOCS("/v3/api-docs/**"),
    SWAGGER_UI_HTML("/swagger-ui.html"),
    SWAGGER_RESOURCES("/swagger-resources/**"),
    SWAGGER_WEBJARS("/webjars/**"),
    SWAGGER_CONFIGURATION("/configuration/**"),

    // Auth 관련 경로
    SIGNUP("/auth/signUp"),
    LOGIN("/auth/login");
 
    private final String path;

    //SecurityPath enum???의??모든 공개 경로?String 배열?변?해주는 메서??    
    public static String[] getAllPublicPaths() {
        return java.util.Arrays.stream(values())
                .map(SecurityPath::getPath)
                .toArray(String[]::new);
    }

    public static boolean matches(String uri) {
        log.info("[SecurityPath] 요청 URI: {}", uri);
        return java.util.Arrays.stream(values())
            .anyMatch(securityPath -> {
                String pattern = securityPath.getPath();
                log.info("[SecurityPath] 비교 패턴: {}, {}", pattern, uri);

                if (pattern.equals(uri)) {
                    return true;
                }

                if (pattern.endsWith("/**")) {
                    log.info("[SecurityPath] /** 패턴 처리: {}", pattern);
                    String basePattern = pattern.substring(0, pattern.length() - 2);
                    return uri.startsWith(basePattern);
                }
                return pattern.equals(uri);
            });
    }

}
