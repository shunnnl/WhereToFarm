package com.backend.farmbti.policy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.farmbti.policy.domain.Policy;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

	// 지역별 혜택 조회
	List<Policy> findByRegion(String region);

}
