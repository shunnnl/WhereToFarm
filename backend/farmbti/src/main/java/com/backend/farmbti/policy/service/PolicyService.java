package com.backend.farmbti.policy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.backend.farmbti.policy.domain.Policy;
import com.backend.farmbti.policy.repository.PolicyRepository;
import com.backend.farmbti.common.dto.CommonResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyService {

	private final PolicyRepository policyRepository;

	// 전체 정책 조회
	public Page<Policy> getAllPolicies(Pageable pageable) {
		return policyRepository.findAll(pageable);
	}

	// 지역별 정책 조회
	public Page<Policy> getPoliciesByRegion(String region, Pageable pageable) {
		return policyRepository.findByRegionContaining(region, pageable);
	}

	// 랜덤 3개 정책 조회
	public List<Policy> getRandomPolicies() {
		Pageable pageable = PageRequest.of(0, 3); // 3개만 가져오도록 설정
		return policyRepository.findRandomPolicies(pageable);
	}
}
