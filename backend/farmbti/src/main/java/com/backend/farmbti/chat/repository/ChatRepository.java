package com.backend.farmbti.chat.repository;

import com.backend.farmbti.chat.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    Optional<Chat> findByMentee_IdAndMentor_Id(Long userId, Long otherId);

    List<Chat> findByMentee_Id(Long userId);
}
