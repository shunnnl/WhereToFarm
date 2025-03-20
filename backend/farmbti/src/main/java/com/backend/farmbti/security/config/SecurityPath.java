package com.backend.farmbti.security.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

//보안 경로�?관리하???�거??Enum) ?�래??-> ??경로???�증 처리�??�함
@Slf4j
@Getter
@AllArgsConstructor
public enum SecurityPath {

    //test 경로
    API_TEST("/actuator/**"),

    //Swagger 관??경로
    SWAGGER_UI("/swagger-ui/**"),
    //SWAGGER_API_DOCS("/v3/api-docs"),
    SWAGGER_API_DOCS("/v3/api-docs/**"),
    SWAGGER_UI_HTML("/swagger-ui.html"),
    SWAGGER_RESOURCES("/swagger-resources/**"),
    SWAGGER_WEBJARS("/webjars/**"),  // 추�? ?�요
    SWAGGER_CONFIGURATION("/configuration/**"), // 추�? ?�요

    // Auth 관??경로
    SIGNUP("/auth/signUp"),
    LOGIN("/auth/login");

    // �?Enum ?�수가 가지??경로 문자??    
    private final String path;

    //SecurityPath enum???�의??모든 공개 경로�?String 배열�?변?�해주는 메서??    
    public static String[] getAllPublicPaths() {
        return java.util.Arrays.stream(values())
                .map(SecurityPath::getPath)
                .toArray(String[]::new);
    }

    public static boolean matches(String uri) {
        log.info("?�� [SecurityPath] ?�청??URI: {}", uri);
        return java.util.Arrays.stream(values())
            .anyMatch(securityPath -> {
                String pattern = securityPath.getPath();
                log.info("?�� [SecurityPath] 비교???�턴: {}, {}", pattern, uri);

                if (pattern.equals(uri)) {
                    log.info("?�� [SecurityPath] ?�확??경로 매칭 ?�인: {}", pattern);
                    return true;
                }

                if (pattern.endsWith("/**")) {
                    log.info("?�� [SecurityPath] /** ?�턴 처리: {}", pattern);
                    String basePattern = pattern.substring(0, pattern.length() - 2);
                    return uri.startsWith(basePattern);
                }
                return pattern.equals(uri);
            });
    }

}
