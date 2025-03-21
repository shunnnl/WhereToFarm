package com.backend.farmbti.crops.controller;

import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.crops.dto.CropsEstimateRequest;
import com.backend.farmbti.crops.service.CropsService;
import com.backend.farmbti.security.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/crops")
public class CropsController {

    private final CropsService cropsService;
    private final SecurityUtils securityUtils;
    private final UsersRepository usersRepository;

    @PostMapping("/estimate")
    @Operation(summary = "작물 계산", description = "작물 계산을 위한 입력 처리합니다.")
    public CommonResponseDto estimate(@RequestBody CropsEstimateRequest request) {
        Long id = securityUtils.getCurrentUsersId();
        return CommonResponseDto.ok(cropsService.estimate(request, id));
    }


}
