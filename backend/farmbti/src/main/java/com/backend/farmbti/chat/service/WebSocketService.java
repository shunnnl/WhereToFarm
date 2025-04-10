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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UsersRepository usersRepository;

    // 사용자 ID와 사용자명을 매핑하는 맵 (스레드 안전한 ConcurrentHashMap 사용)
    private final Map<Long, String> userUsernameMap = new ConcurrentHashMap<>();
    private final Map<String, Boolean> userActiveStatus = new ConcurrentHashMap<>();

    @Transactional
    public MessageResponse saveAndGetMessage(Long roomId, String message, Long senderId) {
        Chat chat = chatRepository.findById(roomId)
                .orElseThrow(() -> new GlobalException(ChatErrorCode.CHAT_ROOM_NOT_EXISTS));

        log.info("메시지 저장 시작 - 방ID: {}, 발신자ID: {}", roomId, senderId);

        ChatMessage chatMessage = ChatMessage.builder()
                .senderId(senderId)
                .content(message)
                .sendAt(LocalDateTime.now())
                .chat(chat)
                .isRead(false) // 초기값은 읽지 않음으로 설정
                .build();

        chatMessageRepository.save(chatMessage);
        log.info("메시지 저장 완료 - 메시지ID: {}", chatMessage.getMessageId());

        return MessageResponse.builder()
                .roomId(chat.getRoomId())
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

    /**
     * 사용자가 속한 모든 채팅방 ID 목록을 조회하는 메소드
     * @param userId 사용자 ID
     * @return 사용자가 속한 채팅방 ID 목록
     */
    @Transactional(readOnly = true)
    public List<Long> getUserRoomIds(Long userId) {
        // 사용자 조회
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 사용자가 멘토인 채팅방 ID 목록 조회
        List<Long> mentorRoomIds = chatRepository.findAllByMentorUser(user)
                .stream()
                .map(Chat::getRoomId)
                .collect(Collectors.toList());

        // 사용자가 멘티인 채팅방 ID 목록 조회
        List<Long> menteeRoomIds = chatRepository.findAllByMenteeId(userId)
                .stream()
                .map(Chat::getRoomId)
                .collect(Collectors.toList());

        // 두 목록 합치기
        mentorRoomIds.addAll(menteeRoomIds);
        return mentorRoomIds;
    }

    /**
     * 사용자 정보를 등록하는 메소드 (채팅방 구독 시 호출)
     * @param userId 사용자 ID
     * @param username 사용자 이름
     * @param roomIds 사용자가 속한 채팅방 ID 목록
     */
    public void registerUserForRoomsNotifications(Long userId, String username, List<Long> roomIds) {
        // 사용자 ID와 사용자명 매핑 저장
        userUsernameMap.put(userId, username);
        // 필요시 사용자별 구독 채팅방 정보도 저장할 수 있음
    }

    @Transactional
    public void markMessagesAsRead(Long roomId, Long userId) {
        log.info("메시지 읽음 처리 시작 - 방ID: {}, 사용자ID: {}", roomId, userId);

        try {
            int updatedCount = chatMessageRepository.markMessagesAsRead(roomId, userId);
            log.info("메시지 읽음 처리 결과 - 방ID: {}, 사용자ID: {}, 업데이트된 메시지 수: {}",
                    roomId, userId, updatedCount);

            // 업데이트 결과가 0인 경우 로그 추가
            if (updatedCount == 0) {
                // 읽지 않은 메시지 개수 확인
                Long unreadCount = chatMessageRepository.countByChat_RoomIdAndIsReadIsFalseAndSenderIdNot(roomId, userId);
                log.info("읽지 않은 메시지 수 확인 - 방ID: {}, 사용자ID: {}, 읽지 않은 메시지 수: {}",
                        roomId, userId, unreadCount);
            }
        } catch (Exception e) {
            log.error("메시지 읽음 처리 중 오류 발생 - 방ID: {}, 사용자ID: {}, 오류: {}",
                    roomId, userId, e.getMessage(), e);
            throw e;
        }
    }

    // 채팅방 사용자 ID 목록 가져오기
    @Transactional(readOnly = true)
    public List<Long> getRoomUserIds(Long roomId) {
        Chat chatRoom = chatRepository.findById(roomId)
                .orElseThrow(() -> new GlobalException(ChatErrorCode.CHAT_ROOM_NOT_FOUND));

        List<Long> userIds = new ArrayList<>();
        userIds.add(chatRoom.getMentor().getUser().getId());
        userIds.add(chatRoom.getMentee().getId());

        return userIds;
    }

    @Transactional(readOnly = true)
    public Long getReceiverId(Long roomId, Long currentUserId) {
        Chat chatRoom = chatRepository.findById(roomId)
                .orElseThrow(() -> new GlobalException(ChatErrorCode.CHAT_ROOM_NOT_FOUND));

        // 채팅방에서 멘토와 멘티 ID 가져오기
        Long mentorId = chatRoom.getMentor().getUser().getId();
        Long menteeId = chatRoom.getMentee().getId();

        // 보낸 사람이 멘토면 멘티에게, 멘티면 멘토에게
        if (currentUserId.equals(mentorId)) {
            return menteeId;
        } else {
            return mentorId;
        }
    }

    public void setUserActive(Long roomId, Long userId, boolean isActive) {
        String key = roomId + ":" + userId;
        userActiveStatus.put(key, isActive);
        log.info("사용자 활성 상태 변경 - 방ID: {}, 사용자ID: {}, 상태: {}", roomId, userId, isActive);
    }
}