package com.backend.farmbti.crops.repository;

import com.backend.farmbti.crops.domain.CropsReport;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropsReportRepository extends JpaRepository<CropsReport, Long> {

    @Query("select cr from CropsReport cr where cr.users.iDd = :usersId")
    List<CropsReport> findByUsersId(@Param("usersId") Long usersId);
}
