package com.backend.farmbti.security.config;

//보안 경로를 관리하는 열거형(Enum) 클래스
public enum SecurityPath {
    // Auth 관련 경로
    SIGNUP("/api/auth/signup"),
    LOGIN("/api/auth/login")

    // 각 Enum 상수가 가지는 경로 문자열
    // private final String path;
}
