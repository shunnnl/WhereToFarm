package com.backend.farmbti.chat.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.chat.dto.ChatListResponse;
import com.backend.farmbti.chat.dto.ChatRequest;
import com.backend.farmbti.chat.dto.ChatResponse;
import com.backend.farmbti.chat.entity.Chat;
import com.backend.farmbti.chat.repository.ChatRepository;
import com.backend.farmbti.common.exception.GlobalException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UsersRepository usersRepository;

    public ChatResponse create(Long userId, ChatRequest chatRequest) {

        Optional<Chat> existingChat = chatRepository.findByMentee_IdAndMentor_Id(userId, chatRequest.getOtherId());

        Chat chat = existingChat.orElseGet(() -> {

            //멘티
            Users user1 = usersRepository.findById(userId)
                    .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

            //멘토
            Users user2 = usersRepository.findById(chatRequest.getOtherId())
                    .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

            Chat newChat = Chat.builder()
                    .mentee(user1)
                    .mentor(user2)
                    .build();
            return chatRepository.save(newChat);

        });

        return ChatResponse.builder()
                .roomId(chat.getRoomId())
                .menteeId(chat.getMentee().getId())
                .mentorId(chat.getMentor().getId())
                .menteeName(chat.getMentee().getName())
                .mentorName(chat.getMentor().getName())
                .mentorProfile(chat.getMentor().getProfileImage())
                .build();

    }

    public List<ChatListResponse> getAllRooms(Long userId) {

        List<Chat> chats = chatRepository.findByMentee_Id(userId);

        List<ChatListResponse> chatListResponse = new ArrayList<>();

        for (Chat chat : chats) {

            chatListResponse.add(ChatListResponse.builder()
                    .mentorName(chat.getMentor().getName())
                    .mentorProfile(chat.getMentor().getProfileImage())
                    // .lastMessage()    가장 마지막에 오는 메시지를 준다
                    .build());
        }

        return chatListResponse;

    }
}
