package com.backend.farmbti.crops.repository;

import com.backend.farmbti.crops.domain.CropsReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CropsReportRepository extends JpaRepository<CropsReport, Long> {

}
