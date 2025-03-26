package com.backend.farmbti.mentors.controller;


import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.mentors.dto.MentorRegisterRequest;
import com.backend.farmbti.mentors.service.MentorsService;
import com.backend.farmbti.security.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
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
}