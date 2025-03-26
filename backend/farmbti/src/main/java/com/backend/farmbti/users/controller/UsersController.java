package com.backend.farmbti.users.controller;

import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.security.util.SecurityUtils;
import com.backend.farmbti.users.dto.CurrentUserResponse;
import com.backend.farmbti.users.dto.PasswordChangeRequest;
import com.backend.farmbti.users.dto.UserDeleteRequest;
import com.backend.farmbti.users.dto.UserUpdateRequest;
import com.backend.farmbti.users.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/delete")
    @Operation(summary = "회원 탈퇴", description = "현재 비밀번호 확인 후 회원 탈퇴를 진행합니다.")
    public CommonResponseDto deleteUser(@RequestBody UserDeleteRequest request) {
        Long userId = securityUtils.getCurrentUsersId();
        usersService.deleteUser(request, userId);
        return CommonResponseDto.ok();
    }

    @PutMapping("/modify")
    @Operation(summary = "회원 정보 수정", description = "사용자 정보(이름, 생년월일, 주소, 성별)을 수정합니다.")
    public CommonResponseDto updateUserInfo(@RequestBody UserUpdateRequest request) {
        Long userId = securityUtils.getCurrentUsersId();
        usersService.updateUserInfo(request, userId);
        return CommonResponseDto.ok();
    }

    @GetMapping("/me")
    @Operation(summary = "내 정보 상세 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    public CommonResponseDto<CurrentUserResponse> getCurrentUser() {
        Long userId = securityUtils.getCurrentUsersId();
        CurrentUserResponse userInfo = usersService.getCurrentUserInfo(userId);
        return CommonResponseDto.ok(userInfo);
    }

}