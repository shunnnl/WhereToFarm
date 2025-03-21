package com.backend.farmbti.crops.repository;

import com.backend.farmbti.crops.domain.Crops;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CropsRepository extends JpaRepository<Crops, Long> {

    Optional<Crops> findByName(String cropsName);
}
