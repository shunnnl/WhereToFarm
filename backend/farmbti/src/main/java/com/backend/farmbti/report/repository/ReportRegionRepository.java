package com.backend.farmbti.report.repository;

import com.backend.farmbti.report.domain.ReportRegion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRegionRepository extends JpaRepository<ReportRegion, Integer> {
}