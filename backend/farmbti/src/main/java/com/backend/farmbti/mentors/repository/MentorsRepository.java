package com.backend.farmbti.mentors.repository;

import com.backend.farmbti.mentors.domain.Mentors;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorsRepository extends JpaRepository<Mentors, Long> {
    boolean existsByUserId(Long userId);
    Optional<Mentors> findByUserId(Long userId);
    List<Mentors> findByUser_AddressContaining(String location);
}