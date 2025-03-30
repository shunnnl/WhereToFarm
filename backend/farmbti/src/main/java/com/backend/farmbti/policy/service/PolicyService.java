package com.backend.farmbti.policy.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.farmbti.policy.domain.Policy;
import com.backend.farmbti.policy.repository.PolicyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyService {

	private final PolicyRepository policyRepository;

	// 혜택 전체 조회
	public List<Policy> getAllPolicies() {
		return policyRepository.findAll();
	}

	// 지역별 혜택 조회
	public List<Policy> getPoliciesByRegion(String region) {
		return policyRepository.findByRegion(region);
	}

}
