package com.backend.farmbti.chat.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.chat.dto.ChatListResponse;
import com.backend.farmbti.chat.dto.ChatRequest;
import com.backend.farmbti.chat.dto.ChatResponse;
import com.backend.farmbti.chat.dto.MessageResponse;
import com.backend.farmbti.chat.entity.Chat;
import com.backend.farmbti.chat.entity.ChatMessage;
import com.backend.farmbti.chat.exception.ChatErrorCode;
import com.backend.farmbti.chat.repository.ChatMessageRepository;
import com.backend.farmbti.chat.repository.ChatRepository;
import com.backend.farmbti.common.exception.GlobalErrorCode;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.common.service.S3Service;
import com.backend.farmbti.mentors.domain.Mentors;
import com.backend.farmbti.mentors.exception.MentorsErrorCode;
import com.backend.farmbti.mentors.repository.MentorsRepository;
import com.backend.farmbti.users.exception.UsersErrorCode;
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
    private final ChatMessageRepository chatMessageRepository;
    private final S3Service s3Service;

    @Transactional
    public ChatResponse create(Long userId, ChatRequest chatRequest) {

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
                .otherUserProfile(getProfileImageUrl(chat.getMentor().getUser()))
                //.otherUserProfile(s3Service.getSignedUrl(chat.getMentor().getUser().getProfileImage()))
                .isCurrentUserMentee(true)
                .build();

    }

    public List<ChatListResponse> getAllRooms(Long userId) {
        List<Chat> chats = chatRepository.findAllByMenteeIdOrMentorUserId(userId, userId);

        return chats.stream()
                .map(chat -> {
                    boolean isUserMentee = chat.getMentee().getId().equals(userId);
                    Long otherUserId = isUserMentee ? chat.getMentor().getUser().getId() : chat.getMentee().getId();

                    // 상대방 유저 찾기
                    Users user = usersRepository.findById(otherUserId)
                            .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

                    // 탈퇴한 유저면 null 리턴 (아래 filter에서 제거됨)
                    if (user.getIsOut() == 1) {
                        System.out.println(" 탈퇴한 유저" + user.getName());
                        return null;
                    }

                    String otherUserName = isUserMentee
                            ? chat.getMentor().getUser().getName()
                            : chat.getMentee().getName();

                    /*
                    String otherUserProfile = isUserMentee
                            ? chat.getMentor().getUser().getProfileImage()
                            : chat.getMentee().getProfileImage();

                     */
                    Users otherUser = isUserMentee
                            ? chat.getMentor().getUser()
                            : chat.getMentee();

                    ChatMessage latestMessageObj = chatMessageRepository.findTopByChat_RoomIdOrderBySendAtDesc(chat.getRoomId());
                    String latestMessage = (latestMessageObj != null) ? latestMessageObj.getContent() : null;

                    return ChatListResponse.builder()
                            .roomId(chat.getRoomId())
                            .otherUserId(otherUserId)
                            .otherUserName(otherUserName)
                            //.otherUserProfile(s3Service.getSignedUrl(otherUserProfile))
                            .otherUserProfile(getProfileImageUrl(otherUser))
                            .lastMessage(latestMessage)
                            .build();
                })
                .filter(Objects::nonNull)  // null 값 제거 (isOut=1이면 제외)
                .collect(Collectors.toList());
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

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessageDetail(Long roomId, Long usersId) {

        List<ChatMessage> chatMessages = chatMessageRepository.findByChat_RoomId(roomId);

        return chatMessages.stream().map(
                messages -> {

                    //현재 로그인한 사용자가 멘티라면
                    //boolean isUserMentee = messages.getChat().getMentee().getId().equals(usersId);

                    //Long otherUserId = isUserMentee ? messages.getChat().getMentor().getId() : messages.getChat().getMentee().getId();

                    return MessageResponse.builder()
                            .senderId(messages.getSenderId())
                            .messageId(messages.getMessageId())
                            .content(messages.getContent())
                            .sentAt(messages.getSendAt())
                            .build();

                }).collect(Collectors.toList());
    }

    private String getProfileImageUrl(Users user) {
        try {
            // 1. 이미 생성된 URL이 있고 만료되지 않았으면 그대로 반환
            if (user.getProfileImageUrl() != null && !user.isProfileImageUrlExpired()) {
                return user.getProfileImageUrl();
            }

            // 2. URL이 없거나 만료된 경우 새로 생성
            String profileImageUrl = s3Service.getOrCreateSignedUrl(user);

            // 3. 생성된 URL 저장
            usersRepository.save(user);

            return profileImageUrl;
        } catch (Exception e) {
            throw new GlobalException(UsersErrorCode.PROFILE_IMAGE_URL_GENERATION_FAILED);
        }
    }
}
