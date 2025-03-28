package com.backend.farmbti.users.controller;

import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.security.util.SecurityUtils;
import com.backend.farmbti.users.dto.*;
import com.backend.farmbti.users.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    /**
     * 기본 프로필 이미지로 변경
     */
    @PutMapping("/reset-default")
    @Operation(summary = "기본 프로필 이미지로 변경", description = "성별에 따라 기본 프로필 이미지로 변경합니다.")
    public CommonResponseDto<UploadProfileImageResponse> resetToDefaultProfileImage() {
        Long userId = securityUtils.getCurrentUsersId();
        UploadProfileImageResponse imageUrl = usersService.resetToDefaultProfileImage(userId);
        return CommonResponseDto.ok(imageUrl);
    }

    /**
     * 프로필 이미지 업로드
     */
    @PutMapping(value = "/upload-profile",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "프로필 이미지 업로드", description = "유저가 직접 업로드한 프로필 이미지로 변경합니다.")
    @ApiResponse(responseCode = "200", description = "이미지 업로드 완료")
    public CommonResponseDto<UploadProfileImageResponse> uploadProfileImage(
            @Parameter(description = "multipart/form-data 형식의 단일 이미지. key는 'file'입니다.")
            @RequestPart("file") MultipartFile file) {

        Long userId = securityUtils.getCurrentUsersId();
        UploadProfileImageResponse imageUrl = usersService.uploadUserProfileImage(userId, file);
        return CommonResponseDto.ok(imageUrl);
    }

}