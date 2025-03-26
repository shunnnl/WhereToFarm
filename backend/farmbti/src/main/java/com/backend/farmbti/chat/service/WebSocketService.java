package com.backend.farmbti.chat.service;

import com.backend.farmbti.chat.dto.MessageResponse;
import com.backend.farmbti.chat.entity.Chat;
import com.backend.farmbti.chat.entity.ChatMessage;
import com.backend.farmbti.chat.exception.ChatErrorCode;
import com.backend.farmbti.chat.repository.ChatMessageRepository;
import com.backend.farmbti.chat.repository.ChatRepository;
import com.backend.farmbti.common.exception.GlobalException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    public MessageResponse saveAndGetMessage(Long roomId, String message) {

        Chat chat = chatRepository.findById(roomId)
                .orElseThrow(() -> new GlobalException(ChatErrorCode.CHAT_ROOM_NOT_EXISTS));

        ChatMessage chatMessage = ChatMessage.builder()
                .content(message)
                .sendAt(LocalDateTime.now())
                .chat(chat)
                .build();

        chatMessageRepository.save(chatMessage);

        return MessageResponse.builder()
                .messageId(chatMessage.getMessageId())
                .content(chatMessage.getContent())
                .sentAt(chatMessage.getSendAt())
                .build();
    }
}
