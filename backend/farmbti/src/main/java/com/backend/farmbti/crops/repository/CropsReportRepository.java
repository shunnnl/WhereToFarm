package com.backend.farmbti.crops.repository;

import com.backend.farmbti.crops.domain.CropsReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropsReportRepository extends JpaRepository<CropsReport, Long> {

    Optional<CropsReport> findByUsers_IdAndId(Long usersId, Long cropsReportId);

   // List<CropsReport> findByUsersIdAndBookmarkedTrue(Long usersId);

    List<CropsReport> findByUsersIdAndBookmarkedTrueOrderByCreatedAtDesc(Long usersId);
}
