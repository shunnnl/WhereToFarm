package com.backend.farmbti.policy.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.farmbti.policy.domain.Policy;
import com.backend.farmbti.policy.dto.PolicyFilterRequestDto;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

	// 혜택 전체 조회
	Page<Policy> findAll(Pageable pageable);

	// 지역별 혜택 조회
	@Query("SELECT p FROM Policy p WHERE p.region LIKE %:region%")
	Page<Policy> findByRegionContaining(@Param("region") String region, Pageable pageable);

	// 랜덤 3개 혜택 조회
	@Query("SELECT p FROM Policy p ORDER BY RANDOM()")
	List<Policy> findRandomPolicies(Pageable pageable);

}
