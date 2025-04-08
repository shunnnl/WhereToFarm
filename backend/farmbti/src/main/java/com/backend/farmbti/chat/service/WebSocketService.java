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
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UsersRepository usersRepository;

    // 사용자 ID와 사용자명을 매핑하는 맵 (스레드 안전한 ConcurrentHashMap 사용)
    private final Map<Long, String> userUsernameMap = new ConcurrentHashMap<>();

    @Transactional
    public MessageResponse saveAndGetMessage(Long roomId, String message, Long senderId) {

        Chat chat = chatRepository.findById(roomId)
                .orElseThrow(() -> new GlobalException(ChatErrorCode.CHAT_ROOM_NOT_EXISTS));

        System.out.println(senderId);

        ChatMessage chatMessage = ChatMessage.builder()
                .senderId(senderId)
                .content(message)
                .sendAt(LocalDateTime.now())
                .chat(chat)
                .build();

        chatMessageRepository.save(chatMessage);

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
                .stream()  // 여기서 Collection의 stream() 메소드 호출
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


    /**
     * 채팅방에 속한 모든 사용자 이름을 조회하는 메소드
     * @param roomId 채팅방 ID
     * @return 채팅방 참가자 이름 목록
     */
    @Transactional(readOnly = true)
    public List<String> getRoomUsernames(Long roomId) {
        // 채팅방 조회
        Chat chatRoom = chatRepository.findById(roomId)
                .orElseThrow(() -> new GlobalException(ChatErrorCode.CHAT_ROOM_NOT_FOUND));

        // 멘토 이름 조회
        String mentorName = chatRoom.getMentor().getUser().getName();

        // 멘티 이름 조회
        Users mentee = usersRepository.findById(chatRoom.getMentee().getId())
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));
        String menteeName = mentee.getName();

        // 참가자 이름 목록 반환
        return List.of(mentorName, menteeName);
    }

    @Transactional
    public void markMessagesAsRead(Long roomId, Long userId) {
        chatMessageRepository.markMessagesAsRead(roomId, userId);
    }
}
