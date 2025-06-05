package com.backend.farmbti.policy.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.farmbti.policy.domain.Policy;
import com.backend.farmbti.policy.dto.PolicyFilterRequestDto;
import com.backend.farmbti.policy.service.PolicyService;
import com.backend.farmbti.common.dto.CommonResponseDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/policy")
@RequiredArgsConstructor
@Tag(name = "혜택 컨트롤러", description = "지원 정책 관련 컨트롤러")
public class PolicyController {

	private final PolicyService policyService;

	@GetMapping
	@Operation(summary = "지원 정책 전체 조회", description = "모든 지원 정책 정보를 조회합니다.")
	public CommonResponseDto<Page<Policy>> getAllPolicies(
		@RequestParam(defaultValue = "0") int page, // 페이지 번호
		@RequestParam(defaultValue = "10") int size // 페이지 크기
	) {
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));
		Page<Policy> policyPage = policyService.getAllPolicies(pageable);
		return CommonResponseDto.ok(policyPage);
	}

	@PostMapping("/region")
	@Operation(summary = "지역별 지원 정책 조회", description = "지역(도, 시군)을 기준으로 정책을 검색합니다.")
	public CommonResponseDto<Page<Policy>> getPoliciesByRegion(
		@RequestBody PolicyFilterRequestDto request,
		@RequestParam(defaultValue = "0") int page, // 페이지 번호
		@RequestParam(defaultValue = "10") int size // 페이지 크기
	) {
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));
		Page<Policy> policies = policyService.getPoliciesByRegion(request, pageable);

		return CommonResponseDto.ok(policies);
	}

	@GetMapping("/main")
	@Operation(summary = "랜덤으로 3개의 지원 정책 조회", description = "랜덤으로 3개의 지원 정책 정보를 조회합니다.")
	public CommonResponseDto<List<Policy>> getRandomPolicies() {
		List<Policy> randomPolicies = policyService.getRandomPolicies();
		return CommonResponseDto.ok(randomPolicies);
	}
}
