package com.backend.farmbti.chat.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.chat.dto.MessageResponse;
import com.backend.farmbti.chat.entity.Chat;
import com.backend.farmbti.chat.entity.ChatMessage;
import com.backend.farmbti.chat.exception.ChatErrorCode;
import com.backend.farmbti.chat.repository.ChatMessageRepository;
import com.backend.farmbti.chat.repository.ChatRepository;
import com.backend.farmbti.common.exception.GlobalException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UsersRepository usersRepository;

    public MessageResponse saveAndGetMessage(Long roomId, String message, Long senderId) {

        Chat chat = chatRepository.findById(roomId)
                .orElseThrow(() -> new GlobalException(ChatErrorCode.CHAT_ROOM_NOT_EXISTS));

        ChatMessage chatMessage = ChatMessage.builder()
                .senderId(senderId)
                .content(message)
                .sendAt(LocalDateTime.now())
                .chat(chat)
                .build();

        chatMessageRepository.save(chatMessage);

        return MessageResponse.builder()
                .messageId(chatMessage.getMessageId())
                .content(chatMessage.getContent())
                .sentAt(chatMessage.getSendAt())
                .senderId(senderId)
                .build();
    }

    @Transactional
    public String getRecevierName(Long roomId, String currentUserName) {

        Chat chatRoom = chatRepository.findById(roomId)
                .orElseThrow(() -> new GlobalException(ChatErrorCode.CHAT_ROOM_NOT_FOUND));

        // 채팅방에서 멘토와 멘티 이름 가져오기
        String mentorName = chatRoom.getMentor().getUser().getName();

        Users mentee = usersRepository.findById(chatRoom.getMentee().getId())
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));
        String menteeName = mentee.getName();

        // 보낸 사람이 멘토면 멘티에게, 멘티면 멘토에게
        if (currentUserName.equals(mentorName)) {
            return menteeName;
        } else {
            return mentorName;
        }

    }
}
