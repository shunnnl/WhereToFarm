package com.backend.farmbti.chat.repository;

import com.backend.farmbti.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    ChatMessage findTopByChat_RoomIdOrderBySendAtDesc(Long roomId);

    List<ChatMessage> findByChat_RoomId(Long roomId);
}
