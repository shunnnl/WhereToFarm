package com.backend.farmbti.security.config;

import lombok.AllArgsConstructor;
import lombok.Getter;

//보안 경로를 관리하는 열거형(Enum) 클래스 -> 이 경로는 인증 처리를 안함
@Getter
@AllArgsConstructor
public enum SecurityPath {

    //Swagger 관련 경로
    SWAGGER("/swagger-ui/**"),
    SWAGGER_HTML("/swagger-ui.html"),
    SWAGGER_API_DOCS("/v3/api-docs"),
    SWAGGER_API_DOCS_ALL("/v3/api-docs/**"),
    SWAGGER_RESOURCES("/swagger-resources/**"),
    SWAGGER_UI("/api/swagger-ui/**"),
    SWAGGER_UI_API_DOCS("/api/v3/api-docs"),
    SWAGGER_UI_API_DOCS_ALL("/api/v3/api-docs/**"),
    SWAGGER_UI_RESOURCES("/api/swagger-resources/**"),
    SWAGGER_UI_HTML("/api/swagger-ui.html"),

    //WebSocket 관련 경로
    WEB_SOCKET("/websocket-test.html"),
    WEB_SOCKET_CONNECTION("/gs-guide-websocket"),
    WEB_SOCKET_INFO("/gs-guide-websocket/info"),
    WEB_SOCKET_WS("wss/**"),
    WEB_SOCKET_ALL("/gs-guide-websocket/**"),

    //static icon
    STATIC("/favicon.ico"),

    // Auth 관련 경로
    SIGNUP("/auth/signUp"),
    LOGIN("/auth/login"),

    // News 관련 경로
    MAIN_NEWS("/news/main"),
    LIST_NEWS("/news/list"),

    // Policy 관련 경로
    POLICY_ALL("/policy"),
    POLICY_REGION("/policy/region"),
    POLITCY_MAIN("/policy/main"),

    // Property 관련 경로
    PROPERTY("/property/**"),

    // Prometheus 관련 경로
    PROMETHEUS("/actuator/**");

    // 각 Enum 상수가 가지는 경로 문자열
    private final String path;

    //SecurityPath enum에 정의된 모든 공개 경로를 String 배열로 변환해주는 메서드
    public static String[] getAllPublicPaths() {
        return java.util.Arrays.stream(values())
                .map(SecurityPath::getPath)
                .toArray(String[]::new);
    }

    public static boolean matches(String uri) {
        return java.util.Arrays.stream(values())
                .anyMatch(securityPath -> {
                    String pattern = securityPath.getPath();
                    // /** 패턴 처리
                    if (pattern.endsWith("/**")) {
                        String basePattern = pattern.substring(0, pattern.length() - 2);
                        return uri.startsWith(basePattern);
                    }
                    // 정확한 경로 매칭
                    return pattern.equals(uri);
                });
    }

}
