package com.backend.farmbti.chat.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.chat.dto.ChatListResponse;
import com.backend.farmbti.chat.dto.ChatRequest;
import com.backend.farmbti.chat.dto.ChatResponse;
import com.backend.farmbti.chat.entity.Chat;
import com.backend.farmbti.chat.exception.ChatErrorCode;
import com.backend.farmbti.chat.repository.ChatRepository;
import com.backend.farmbti.common.exception.GlobalErrorCode;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.mentors.domain.Mentors;
import com.backend.farmbti.mentors.exception.MentorsErrorCode;
import com.backend.farmbti.mentors.repository.MentorsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UsersRepository usersRepository;
    private final MentorsRepository mentorsRepository;

    @Transactional
    public ChatResponse create(Long userId, ChatRequest chatRequest) {

        // 먼저 ID 동일성 검증
        if (Objects.equals(userId, chatRequest.getOtherId())) {
            throw new GlobalException(ChatErrorCode.SELF_MENTORING_NOT_ALLOWED);
        }

        //로그인한 사용자와 상대방이 있는 채팅이 있을 때 사용
        //우리는 멘티만 채팅을 걸 수 있다.
        Optional<Chat> existingChat = chatRepository.findByMentee_IdAndMentor_Id(userId, chatRequest.getOtherId());

        Chat chat = existingChat.orElseGet(() -> {

            //멘티
            Users user = usersRepository.findById(userId)
                    .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

            //멘토
            Mentors mentor = mentorsRepository.findById(chatRequest.getOtherId())
                    .orElseThrow(() -> new GlobalException(MentorsErrorCode.MENTOR_NOT_FOUND));

            Chat newChat = Chat.builder()
                    .mentee(user)
                    .mentor(mentor)
                    .build();
            return chatRepository.save(newChat);

        });

        return ChatResponse.builder()
                .roomId(chat.getRoomId())
                .currentUserId(chat.getMentee().getId())
                .otherUserId(chat.getMentor().getId())
                .currentUserName(chat.getMentee().getName())
                .otherUserName(chat.getMentor().getUser().getName())
                .otherUserProfile(chat.getMentor().getUser().getProfileImage())
                .isCurrentUserMentee(true)
                .build();

    }

    @Transactional(readOnly = true)
    public List<ChatListResponse> getAllRooms(Long userId) {

        //멘토는 멘티가 보여야 하고
        //멘티는 멘토가 보여야 한다.
        //멘티가 조회했을때만 채팅방 목록이 보인다.

        //멘토나 멘티 중에서 현재 로그인한 사용자가 있다면 모두 가져온다.
        List<Chat> chats = chatRepository.findAllByMenteeIdOrMentorUserId(userId, userId);

        //내가 채팅한 모든 chat 객체에 대해서
        return chats.stream().map(chat -> {
            //현재 로그인한 사용자가 멘티라면
            boolean isUserMentee = chat.getMentee().getId().equals(userId);

            Long otherUserId = isUserMentee ? chat.getMentor().getUser().getId() : chat.getMentee().getId();

            String otherUserName = isUserMentee
                    ? chat.getMentor().getUser().getName()
                    : chat.getMentee().getName();

            String otherUserProfile = isUserMentee
                    ? chat.getMentor().getUser().getProfileImage()
                    : chat.getMentee().getProfileImage();

            return ChatListResponse.builder()
                    .roomId(chat.getRoomId())
                    .otherUserId(otherUserId)
                    .otherUserName(otherUserName)
                    .otherUserProfile(otherUserProfile)
                    .build();

        }).collect(Collectors.toList());

    }

    public void deleteRoom(Long usersId, Long roomId) {
        // 채팅방 ID로 채팅방 찾기
        Chat chat = chatRepository.findById(roomId)
                .orElseThrow(() -> new GlobalException(ChatErrorCode.CHAT_ROOM_NOT_EXISTS));

        // 2. 권한 검증 - 요청한 사용자가 멘토이거나 멘티일 때 삭제 가능
        boolean isAuthorized = chat.getMentee().getId().equals(usersId) ||
                chat.getMentor().getId().equals(usersId);

        if (!isAuthorized) {
            throw new GlobalException(GlobalErrorCode.UNAUTHORIZED_ACCESS);
        }

        chatRepository.deleteById(roomId);

    }
}
