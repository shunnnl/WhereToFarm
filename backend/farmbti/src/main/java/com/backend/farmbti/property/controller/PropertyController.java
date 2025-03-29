package com.backend.farmbti.property.controller;

import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.property.dto.PropertyListResponse;
import com.backend.farmbti.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
@Tag(name = "부동산 매물 컨트롤러", description = "부동산 매물 조회, 검색, 상세 정보 제공 API")
@Slf4j
public class PropertyController {

    private final PropertyService propertyService;

    @Operation(summary = "모든 매물 조회", description = "모든 부동산 매물 정보를 리스트로 제공합니다.")
    @GetMapping
    public CommonResponseDto<List<PropertyListResponse>> getAllProperties() {
        log.info("모든 매물 조회 요청 수신");
        List<PropertyListResponse> properties = propertyService.getAllProperties();
        return CommonResponseDto.ok(properties);
    }


}