package com.backend.farmbti.auth.controller;

import com.backend.farmbti.auth.dto.SignUpRequestDto;
import com.backend.farmbti.auth.service.AuthService;
import com.backend.farmbti.common.dto.CommonResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "회원 컨트롤러", description = "로그인, 회원가입, 사용자 인증토큰 발급 등 회원정보를 관리하는 컨트롤러")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입", description = "회원가입을 처리합니다.")
    @PostMapping("/singUp")
    public CommonResponseDto singUp(@RequestBody SignUpRequestDto request) {
        authService.singUp(request);
        return CommonResponseDto.ok();
    }


}
