package com.backend.farmbti.chat.repository;

import com.backend.farmbti.chat.entity.Chat;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    Optional<Chat> findByMentee_IdAndMentor_Id(Long userId, Long otherId);


    // JOIN FETCH를 사용하여 N+1 문제 해결
    @Query("SELECT c FROM Chat c " +
            "LEFT JOIN FETCH c.mentee " +
            "LEFT JOIN FETCH c.mentor m " +
            "LEFT JOIN FETCH m.user " +
            "WHERE c.mentee.id = :menteeId OR m.user.id = :mentorUserId")
    List<Chat> findAllByMenteeIdOrMentorUserId(
            @Param("menteeId") Long menteeId,
            @Param("mentorUserId") Long mentorUserId);
    //"mentee의 id가 주어진 값과 일치하거나 mentor의 user의 id가 주어진 값과 일치하는 모든 Chat 엔티티를 찾아라"
}
