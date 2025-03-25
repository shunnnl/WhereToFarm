package com.backend.farmbti.users.controller;

import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.security.util.SecurityUtils;
import com.backend.farmbti.users.dto.PasswordChangeRequest;
import com.backend.farmbti.users.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Tag(name = "사용자 관리 컨트롤러", description = "사용자 정보를 관리하는 컨트롤러")
public class UsersController {

    private final UsersService usersService;
    private final SecurityUtils securityUtils;

    @PostMapping("/password")
    @Operation(summary = "비밀번호 변경", description = "현재 비밀번호 확인 후 새 비밀번호로 변경합니다.")
    public CommonResponseDto changePassword(@RequestBody PasswordChangeRequest request) {
        Long userId = securityUtils.getCurrentUsersId();
        usersService.changePassword(request, userId);
        return CommonResponseDto.ok();
    }
}