package com.backend.farmbti.chat.repository;

import com.backend.farmbti.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    ChatMessage findTopByChat_RoomIdOrderBySendAtDesc(Long roomId);

    List<ChatMessage> findByChat_RoomId(Long roomId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.chat.roomId = :roomId AND m.senderId != :userId AND m.isRead = false")
    void markMessagesAsRead(@Param("roomId") Long roomId, @Param("userId") Long userId);

    // 이것을 사용하세요
    Long countByChat_RoomIdAndIsReadIsFalseAndSenderIdNot(Long roomId, Long userId);
}
