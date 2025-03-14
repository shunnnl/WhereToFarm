package com.backend.farmbti.security.config;

import lombok.AllArgsConstructor;
import lombok.Getter;

//보안 경로를 관리하는 열거형(Enum) 클래스 -> 이 경로는 인증 처리를 안함
@Getter
@AllArgsConstructor
public enum SecurityPath {
    // Auth 관련 경로
    SIGNUP("/api/auth/signup"),
    LOGIN("/api/auth/login");

    // 각 Enum 상수가 가지는 경로 문자열
    private final String path;

    //SecurityPath enum에 정의된 모든 공개 경로를 String 배열로 변환해주는 메서드
    public static String[] getAllPublicPaths() {
        return java.util.Arrays.stream(values())
                .map(SecurityPath::getPath)
                .toArray(String[]::new);
    }
}
