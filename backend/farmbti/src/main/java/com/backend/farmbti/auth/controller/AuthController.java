package com.backend.farmbti.auth.controller;

import com.backend.farmbti.auth.dto.LoginRequest;
import com.backend.farmbti.auth.dto.LoginResponse;
import com.backend.farmbti.auth.dto.RefreshTokenRequest;
import com.backend.farmbti.auth.dto.SignUpRequest;
import com.backend.farmbti.auth.service.AuthService;
import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.security.dto.Token;
import com.backend.farmbti.security.jwt.JwtTokenProvider;
import com.backend.farmbti.security.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.SignatureException;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "회원 컨트롤러", description = "로그인, 회원가입, 사용자 인증토큰 발급 등 회원정보를 관리하는 컨트롤러")
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final SecurityUtils securityUtils;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "회원가입", description = "회원가입을 처리합니다.")
    @PostMapping("/signUp")
    public CommonResponseDto signUp(@RequestBody SignUpRequest request) {
        log.info("회원가입 요청 수신: {}", request);  // 전체 객체 로깅
        log.info("회원가입 요청 수신: {}", request.getEmail());
        authService.signUp(request);
        return CommonResponseDto.ok();
    }

    @Operation(summary = "로그인", description = "로그인을 처리합니다.")
    @PostMapping("/login")
    public CommonResponseDto<LoginResponse> singUp(@RequestBody LoginRequest request) {
        return CommonResponseDto.ok(authService.login(request));
    }

    @Operation(summary = "리프레쉬", description = "리프레쉬 토큰을 처리합니다.")
    @PostMapping("/refresh")
    public CommonResponseDto refreshToken(@RequestBody RefreshTokenRequest request) throws SignatureException {
        Token newToken = jwtTokenProvider.refreshAccessToken(request.getRefreshToken());
        return CommonResponseDto.ok(newToken);
    }


    @Operation(summary = "로그아웃", description = "로그아웃을 처리합니다.")
    @PostMapping("/logout")
    public CommonResponseDto logout() {
        //현재 로그인한 사용자의 id 가져오기
        Long id = securityUtils.getCurrentUsersId();
        authService.logout(id);
        return CommonResponseDto.ok();
    }


}
