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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRepository chatRepository;
    private final UsersRepository usersRepository;
    private final MentorsRepository mentorsRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final S3Service s3Service;

    @Transactional
    public ChatResponse create(Long userId, ChatRequest chatRequest) {
        log.info("🔍 채팅 생성 요청 - 사용자 ID: {}, 상대방 ID(멘토): {}", userId, chatRequest.getOtherId());

        // 멘토
        Mentors mentor = mentorsRepository.findById(chatRequest.getOtherId())
                .orElseThrow(() -> {
                    log.error("❌ 멘토 조회 실패 - ID: {}", chatRequest.getOtherId());
                    return new GlobalException(MentorsErrorCode.MENTOR_NOT_FOUND);
                });

        // 멘토의 사용자 ID 조회
        Long mentorUserId = mentor.getUser().getId();
        log.info("🔍 멘토의 사용자 ID: {}", mentorUserId);

        // 현재 사용자가 멘토인지 확인
        Optional<Mentors> currentUserMentor = mentorsRepository.findByUserId(userId);

        // 두 가지 가능한 조합 모두 검색
        Optional<Chat> existingChat1 = chatRepository.findByMentee_IdAndMentor_Id(userId, chatRequest.getOtherId());

        Optional<Chat> existingChat2 = Optional.empty();
        if (currentUserMentor.isPresent()) {
            existingChat2 = chatRepository.findByMentee_IdAndMentor_Id(mentorUserId, currentUserMentor.get().getId());
        }

        // 둘 중 하나라도 존재하면 그것을 사용
        Optional<Chat> existingChat = existingChat1.isPresent() ? existingChat1 : existingChat2;

        Chat chat = existingChat.orElseGet(() -> {
            log.info("📨 기존 채팅방 없음 - 새로 생성 시작");

            // 멘티
            Users user = usersRepository.findById(userId)
                    .orElseThrow(() -> {
                        log.error("❌ 멘티 조회 실패 - ID: {}", userId);
                        return new GlobalException(AuthErrorCode.USER_NOT_FOUND);
                    });

            log.info("✅ 멘티 조회 완료 - 이름: {}", user.getName());
            log.info("✅ 멘토 조회 완료 - 이름: {}", mentor.getUser().getName());

            Chat newChat = Chat.builder()
                    .mentee(user)
                    .mentor(mentor)
                    .build();

            Chat savedChat = chatRepository.save(newChat);
            log.info("💾 채팅방 저장 완료 - Room ID: {}", savedChat.getRoomId());
            return savedChat;
        });

        // 응답 생성 시 현재 사용자가 채팅방의 멘티인지 확인
        boolean isCurrentUserMentee = chat.getMentee().getId().equals(userId);

        // 현재 사용자와 상대방 정보 설정
        Long currentUserId, otherUserId;
        String currentUserName, otherUserName;
        String profileImageUrl;

        if (isCurrentUserMentee) {
            // 현재 사용자가 멘티인 경우
            currentUserId = chat.getMentee().getId();
            otherUserId = chat.getMentor().getId();
            currentUserName = chat.getMentee().getName();
            otherUserName = chat.getMentor().getUser().getName();
            profileImageUrl = getProfileImageUrl(chat.getMentor().getUser());
        } else {
            // 현재 사용자가 멘토인 경우
            currentUserId = chat.getMentor().getUser().getId();
            otherUserId = chat.getMentee().getId();
            currentUserName = chat.getMentor().getUser().getName();
            otherUserName = chat.getMentee().getName();
            profileImageUrl = getProfileImageUrl(chat.getMentee());
        }

        log.info("📦 채팅방 응답 생성 완료 - Room ID: {}, 상대방 이름: {}", chat.getRoomId(), otherUserName);

        return ChatResponse.builder()
                .roomId(chat.getRoomId())
                .currentUserId(currentUserId)
                .otherUserId(otherUserId)
                .currentUserName(currentUserName)
                .otherUserName(otherUserName)
                .otherUserProfile(profileImageUrl)
                .isCurrentUserMentee(isCurrentUserMentee)
                .build();
    }


    @Transactional
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
            log.debug("ProfileImageURL 조회 시작 - 사용자 ID: {}", user.getId());

            // 1. 이미 생성된 URL이 있고 만료되지 않았으면 그대로 반환
            if (user.getProfileImageUrl() != null && !user.isProfileImageUrlExpired()) {
                log.debug("기존 URL 사용 - 사용자 ID: {}, 만료 시간: {}",
                        user.getId(), user.getProfileImageUrlExpiresAt());
                return user.getProfileImageUrl();
            }

            log.debug("URL 없거나 만료됨 - 사용자 ID: {}, 현재 URL: {}, 만료 시간: {}",
                    user.getId(), user.getProfileImageUrl(), user.getProfileImageUrlExpiresAt());

            // 2. URL이 없거나 만료된 경우 새로 생성
            String profileImageKey = user.getProfileImage();
            log.debug("프로필 이미지 키: {}", profileImageKey);

            String profileImageUrl = s3Service.getOrCreateSignedUrl(user);
            log.debug("새 URL 생성 완료 - 사용자 ID: {}, 새 URL: {}", user.getId(), profileImageUrl);

            // 3. 생성된 URL 저장
            usersRepository.save(user);
            log.debug("URL DB 저장 완료 - 사용자 ID: {}, 만료 시간: {}",
                    user.getId(), user.getProfileImageUrlExpiresAt());

            return profileImageUrl;
        } catch (Exception e) {
            log.error("URL 생성 실패 - 사용자 ID: {}, 오류 메시지: {}",
                    user.getId(), e.getMessage(), e);
            throw new GlobalException(UsersErrorCode.PROFILE_IMAGE_URL_GENERATION_FAILED);
        }
    }
}
