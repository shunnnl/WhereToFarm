package com.backend.farmbti.chat.repository;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.chat.entity.Chat;
import com.backend.farmbti.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

@Repository
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

    List<Chat> findAllByMentorUser(Users user);

    List<Chat> findAllByMenteeId(Long userId);

    @Query("SELECT c FROM Chat c WHERE " +
            "(c.mentee.id = :user1Id AND c.mentor.id = :user2MentorId) OR " +
            "(c.mentee.id = :user2Id AND c.mentor.id = :user1MentorId)")
    Optional<Chat> findChatBetweenUsers(
            @Param("user1Id") Long user1Id,
            @Param("user2MentorId") Long user2MentorId,
            @Param("user2Id") Long user2Id,
            @Param("user1MentorId") Long user1MentorId);

    // 두 사용자 간의 모든 채팅방 찾기 (어느 쪽이 멘토/멘티인지 관계없이)
    @Query("SELECT c FROM Chat c WHERE " +
            "(c.mentee.id = :userId1 AND c.mentor.user.id = :userId2) OR " +
            "(c.mentee.id = :userId2 AND c.mentor.user.id = :userId1)")
    Optional<Chat> findChatBetweenAnyUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    // Optional<Chat> findChatBetweenUsers(Long userId, Long otherId);
    //"mentee의 id가 주어진 값과 일치하거나 mentor의 user의 id가 주어진 값과 일치하는 모든 Chat 엔티티를 찾아라"
}
