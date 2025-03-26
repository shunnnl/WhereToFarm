package com.backend.farmbti.mentors.repository;

import com.backend.farmbti.mentors.domain.MentorsCrops;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorsCropsRepository extends JpaRepository<MentorsCrops, Long> {
    List<MentorsCrops> findByMentorId(Long mentorId);
    void deleteByMentorId(Long mentorId);

}