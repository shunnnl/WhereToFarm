package com.backend.farmbti.property.controller;

import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.property.dto.PropertyDetailResponse;
import com.backend.farmbti.property.dto.PropertyListResponse;
import com.backend.farmbti.property.dto.PropertySearchRequest;
import com.backend.farmbti.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/property")
@RequiredArgsConstructor
@Tag(name = "부동산 매물 컨트롤러", description = "부동산 매물 조회, 검색, 상세 정보 제공하는 컨트롤러")
@Slf4j
public class PropertyController {

    private final PropertyService propertyService;

    @Operation(summary = "모든 매물 조회", description = "모든 부동산 매물 정보를 리스트로 제공합니다.")
    @GetMapping("/list")
    public CommonResponseDto<List<PropertyListResponse>> getAllProperties() {
        log.info("모든 매물 조회 요청 수신");
        List<PropertyListResponse> properties = propertyService.getAllProperties();
        return CommonResponseDto.ok(properties);
    }

    @Operation(summary = "매물 검색", description = "지역(도, 시군)을 기준으로 매물을 검색합니다.")
    @PostMapping("/search")
    public CommonResponseDto<List<PropertyListResponse>> searchProperties(@RequestBody PropertySearchRequest request) {
        List<PropertyListResponse> searchResults = propertyService.searchProperties(request);
        return CommonResponseDto.ok(searchResults);
    }

    @Operation(summary = "매물 상세 조회", description = "특정 매물의 상세 정보와 위치 좌표를 제공합니다.")
    @GetMapping("/{id}")
    public CommonResponseDto<PropertyDetailResponse> getPropertyDetail(@PathVariable Long id) {
        PropertyDetailResponse property = propertyService.getPropertyDetail(id);
        return CommonResponseDto.ok(property);
    }
}