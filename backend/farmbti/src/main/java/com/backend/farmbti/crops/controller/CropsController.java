package com.backend.farmbti.crops.controller;

import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.crops.dto.CropsEstimateRequest;
import com.backend.farmbti.crops.service.CropsService;
import com.backend.farmbti.security.util.SecurityUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/crops")
@Tag(name = "작물 계산기 컨트롤러", description = "평 당 면적, 순 수익 등 작물 계산기 정보를 관리하는 컨트롤러")
public class CropsController {

    private final CropsService cropsService;
    private final SecurityUtils securityUtils;

    @PostMapping("/estimate")
    @Operation(summary = "작물 계산", description = "작물 계산을 위한 입력 처리합니다.")
    public CommonResponseDto estimate(@RequestBody CropsEstimateRequest request) throws JsonProcessingException {
        Long id = securityUtils.getCurrentUsersId();
        return CommonResponseDto.ok(cropsService.estimate(request, id));
    }

    @PostMapping("/estimate/{reportId}")
    @Operation(summary = "작물 계산기 저장", description = "작물 저장하기를 누르면 마이페이지에 계산기가 저장됩니다.")
    public CommonResponseDto bookmarkCrops(@PathVariable(name = "reportId") Long reportId) {
        Long id = securityUtils.getCurrentUsersId();
        cropsService.bookmarkCrops(id, reportId);
        return CommonResponseDto.ok();
    }

    @DeleteMapping("/delete/{reportId}")
    @Operation(summary = "작물 계산기 삭제", description = "작물 삭제하기를 누르면 마이페이지에 계산기가 삭제됩니다.")
    public CommonResponseDto deleteCrops(@PathVariable(name = "reportId") Long reportId) {
        Long id = securityUtils.getCurrentUsersId();
        cropsService.delete(id, reportId);
        return CommonResponseDto.ok();
    }

    @GetMapping("/get/all")
    @Operation(summary = "작물 계산기 조회", description = "마이페이지에서 작물 계산기를 조회합니다.")
    public CommonResponseDto getCrops() {
        Long id = securityUtils.getCurrentUsersId();
        return CommonResponseDto.ok(cropsService.getCrops(id));
    }

    @GetMapping("/get/{reportId}")
    @Operation(summary = "작물 계산기 상세 조회", description = "마이페이지에서 작물 계산기를 상세 조회합니다.")
    public CommonResponseDto getCrops(@PathVariable(name = "reportId") Long reportId) throws JsonProcessingException {
        Long id = securityUtils.getCurrentUsersId();
        return CommonResponseDto.ok(cropsService.getCropsDetail(id, reportId));
    }


}
