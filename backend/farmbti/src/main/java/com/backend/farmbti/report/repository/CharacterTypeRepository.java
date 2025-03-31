package com.backend.farmbti.report.repository;

import com.backend.farmbti.report.domain.CharacterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CharacterTypeRepository extends JpaRepository<CharacterType, Integer> {
}