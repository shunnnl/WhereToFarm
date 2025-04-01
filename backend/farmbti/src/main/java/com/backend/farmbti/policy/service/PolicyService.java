package com.backend.farmbti.policy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.backend.farmbti.policy.domain.Policy;
import com.backend.farmbti.policy.dto.PolicyFilterRequestDto;
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
	public Page<Policy> getPoliciesByRegion(PolicyFilterRequestDto request, Pageable pageable) {
		if (request.getDo_() == null && request.getCity() == null) {
			return policyRepository.findAll(pageable);
		}
		else if (request.getDo_() != null && request.getCity() == null) {
			return policyRepository.findByRegionContaining(request.getDo_(), pageable);
		}
		else if (request.getDo_() == null && request.getCity() != null){
			return policyRepository.findByRegionContaining(request.getCity(), pageable);
		}
		else {
			String full_region = request.getDo_() + " " + request.getCity();
			return policyRepository.findByRegionContaining(full_region, pageable);
		}
	}

	// 랜덤 3개 정책 조회
	public List<Policy> getRandomPolicies() {
		Pageable pageable = PageRequest.of(0, 3); // 3개만 가져오도록 설정
		return policyRepository.findRandomPolicies(pageable);
	}
}
