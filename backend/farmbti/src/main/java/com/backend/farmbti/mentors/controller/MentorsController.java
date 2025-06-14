package com.backend.farmbti.mentors.controller;


import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.mentors.dto.MentorListResponse;
import com.backend.farmbti.mentors.dto.MentorLocationRequest;
import com.backend.farmbti.mentors.dto.MentorRegisterRequest;
import com.backend.farmbti.mentors.service.MentorsService;
import com.backend.farmbti.security.util.SecurityUtils;
import com.backend.farmbti.users.dto.CurrentUserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mentors")
@Tag(name = "멘토 관리 컨트롤러", description = "멘토 정보를 관리하는 컨트롤러")
public class MentorsController {

    private final MentorsService mentorsService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @Operation(summary = "멘토 등록", description = "사용자를 멘토로 등록하고 재배 작물을 지정합니다.")
    public CommonResponseDto registerMentor(@RequestBody MentorRegisterRequest request) {
        Long userId = securityUtils.getCurrentUsersId();
        mentorsService.registerMentor(request, userId);
        return CommonResponseDto.ok();
    }

    @PutMapping("/modify")
    @Operation(summary = "멘토 정보 수정", description = "로그인한 멘토의 정보(귀농시작년도, 소개, 키우는 작물)를 수정합니다.")
    public CommonResponseDto<CurrentUserResponse> updateMentorInfo(@RequestBody MentorRegisterRequest request) {
        Long userId = securityUtils.getCurrentUsersId();
        CurrentUserResponse updatedUserInfo = mentorsService.updateMentorInfo(request, userId);
        return CommonResponseDto.ok(updatedUserInfo);
    }

    @PostMapping("/by-location")
    @Operation(summary = "지역별 멘토 조회", description = "도 및 시/군/구 정보를 사용하여 멘토를 조회합니다.")
    public CommonResponseDto<List<MentorListResponse>> getMentorsByLocation(@RequestBody MentorLocationRequest request) {
        List<MentorListResponse> mentors = mentorsService.getMentorsByLocation(request.getDoName(), request.getCityName());
        return CommonResponseDto.ok(mentors);
    }
}