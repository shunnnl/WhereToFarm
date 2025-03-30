package com.backend.farmbti.policy.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.farmbti.policy.domain.Policy;
import com.backend.farmbti.policy.service.PolicyService;

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
	public List<Policy> getAllPolicies() {
		return policyService.getAllPolicies();
	}

	@GetMapping("/region")
	@Operation(summary = "지역별 지원 정책 조회", description = "입력한 지역에 해당하는 지원 정책 정보를 조회합니다.")
	public List<Policy> getPoliciesByRegion(
		@Parameter(description = "정책 지역명", example = "하동군")
		@RequestParam String region
	) {
		return policyService.getPoliciesByRegion(region);
	}
}
