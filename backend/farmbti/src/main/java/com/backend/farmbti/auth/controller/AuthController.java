package com.backend.farmbti.auth.controller;

import com.backend.farmbti.auth.dto.*;
import com.backend.farmbti.auth.service.AuthService;
import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.security.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "회원 컨트롤러", description = "로그인, 회원가입, 사용자 인증토큰 발급 등 회원정보를 관리하는 컨트롤러")
public class AuthController {

    private final AuthService authService;
    private final SecurityUtils securityUtils;

    @Operation(summary = "회원가입", description = "회원가입을 처리합니다.")
    @PostMapping("/singUp")
    public CommonResponseDto singUp(@RequestBody SignUpRequest request) {
        authService.singUp(request);
        return CommonResponseDto.ok();
    }

    @Operation(summary = "로그인", description = "로그인을 처리합니다.")
    @PostMapping("/login")
    public CommonResponseDto<LoginResponse> singUp(@RequestBody LoginRequest request) {
        return CommonResponseDto.ok(authService.login(request));
    }

    @Operation(summary = "로그아웃", description = "로그아웃을 처리합니다.")
    @PostMapping("/logout")
    public CommonResponseDto logout() {
        //현재 로그인한 사용자의 id 가져오기
        Long id = securityUtils.getCurrentUserId();
        authService.logout(id);
        return CommonResponseDto.ok();
    }

    @Operation(summary = "회원수정", description = "프로필 이미지를 제외한 회원과 관련된 정보를 수정합니다.")
    @PatchMapping("/update")
    public CommonResponseDto modify(@RequestBody ModifyRequest request) {
        authService.modify(request);
        return CommonResponseDto.ok();
    }

    @Operation(summary = "회원수정", description = "프로필 이미지 정보를 수정합니다.")
    @PatchMapping("/update/profile")
    public CommonResponseDto modifyProfile(@RequestBody ModifyProfileRequest request) {
        authService.modifyProfile(request);
        return CommonResponseDto.ok();
    }

    @Operation(summary = "회원수정", description = "비밀번호 정보를 수정합니다.")
    @PatchMapping("/update/password")
    public CommonResponseDto modifyPassword(@RequestBody ModifyPasswordRequest request) {
        authService.modifyPassword(request);
        return CommonResponseDto.ok();
    }


}
