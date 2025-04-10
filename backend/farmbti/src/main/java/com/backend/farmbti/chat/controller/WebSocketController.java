package com.backend.farmbti.chat.controller;

import com.backend.farmbti.chat.dto.MessageRequest;
import com.backend.farmbti.chat.dto.MessageResponse;
import com.backend.farmbti.chat.exception.ChatErrorCode;
import com.backend.farmbti.chat.service.WebSocketService;
import com.backend.farmbti.common.exception.GlobalException;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Tag(name = "WebSocket 채팅 컨트롤러", description = "실시간 채팅 메시지 처리를 위한 컨트롤러")
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final WebSocketService webSocketService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/{roomId}/send")
    @SendTo("/topic/chat/{roomId}")
    public MessageResponse sendMessage(@DestinationVariable Long roomId, MessageRequest messageRequest) {
        log.info("메시지 수신 - 방ID: {}, 발신자ID: {}, 메시지: {}",
                roomId, messageRequest.getSenderId(), messageRequest.getMessage());

        if (messageRequest.getMessage().length() >= 2000) {
            throw new GlobalException(ChatErrorCode.MESSAGE_TO_LONG);
        }

        // 메시지 처리 로직
        MessageResponse messageResponse = webSocketService.saveAndGetMessage(roomId, messageRequest.getMessage(), messageRequest.getSenderId());

        //메시지 보내는 사람 즉, 로그인 한 사람
        String currentUserName = messageRequest.getSenderName();

        //메시지를 받는 사람 즉, 상대방
        String receiverUsername = webSocketService.getRecevierName(roomId, currentUserName);

        log.info("보내는 사람: {} (ID: {})", currentUserName, messageRequest.getSenderId());
        log.info("받는 사람: {}", receiverUsername);

        // 이 부분을 수정: getRecevierName 대신 getReceiverId 메소드 필요
        Long receiverId = webSocketService.getReceiverId(roomId, messageRequest.getSenderId());

        // 알림 발송 로직
        Map<String, Object> notification = new HashMap<>();
        notification.put("sender", currentUserName);
        notification.put("senderId", messageRequest.getSenderId());
        notification.put("timestamp", messageResponse.getSentAt());
        notification.put("roomId", roomId);
        notification.put("message", messageRequest.getMessage());

        // 이 부분을 수정: 사용자 이름 대신 ID로 전송
        try {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(receiverId), // ID를 문자열로 변환
                    "/queue/notifications",
                    notification
            );
            log.info("알림 전송 성공 - 수신자ID: {}", receiverId);
        } catch (Exception e) {
            log.error("알림 전송 실패 - 수신자ID: {}, 오류: {}", receiverId, e.getMessage(), e);
        }

        // 채팅방 목록 업데이트를 위한 알림 전송 (모든 참가자에게)
        List<Long> roomUserIds = webSocketService.getRoomUserIds(roomId);
        for (Long roomUserId : roomUserIds) {
            if (!roomUserId.equals(messageRequest.getSenderId())) {  // 발신자는 제외
                // 채팅 목록 업데이트용 알림 데이터 구성
                Map<String, Object> listUpdate = new HashMap<>();
                listUpdate.put("type", "roomUpdate");
                listUpdate.put("roomId", roomId);
                listUpdate.put("lastMessage", messageRequest.getMessage());
                listUpdate.put("sender", currentUserName);
                listUpdate.put("senderId", messageRequest.getSenderId());
                listUpdate.put("timestamp", messageResponse.getSentAt());
                listUpdate.put("senderProfile", messageRequest.getSenderProfile());

                // 채팅 목록 업데이트 알림 전송
                messagingTemplate.convertAndSendToUser(
                        String.valueOf(roomUserId), // ID를 문자열로 변환
                        "/queue/room-updates",
                        listUpdate
                );
                log.info("채팅 목록 업데이트 알림 전송 - 수신자ID: {}", roomUserId);
            }
        }

        return messageResponse;
    }

    @MessageMapping("/subscribe-all-rooms")
    public void subscribeAllRooms(MessageRequest request) {
        Long userId = request.getSenderId();
        String username = request.getSenderName();
        log.info("모든 채팅방 구독 요청 - 사용자ID: {}, 사용자명: {}", userId, username);

        // 사용자가 속한 모든 채팅방 ID 목록 조회
        List<Long> userRoomIds = webSocketService.getUserRoomIds(userId);

        // 사용자 정보와 채팅방 정보를 저장 (실시간 알림 전송용)
        webSocketService.registerUserForRoomsNotifications(userId, username, userRoomIds);

        // 구독 성공 메시지 (선택적)
        Map<String, Object> subscriptionResult = new HashMap<>();
        subscriptionResult.put("status", "success");
        subscriptionResult.put("message", "모든 채팅방 구독 완료");
        subscriptionResult.put("roomCount", userRoomIds.size());

        // 구독 결과 알림
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/queue/subscription-result",
                subscriptionResult
        );
        log.info("채팅방 구독 완료 - 사용자ID: {}, 구독한 채팅방 수: {}", userId, userRoomIds.size());
    }

    @MessageMapping("/{roomId}/enter")
    public void enterChatRoom(@DestinationVariable Long roomId, MessageRequest messageRequest) {
        Long userId = messageRequest.getSenderId();
        String currentUserName = messageRequest.getSenderName();
        log.info("채팅방 입장 - 방ID: {}, 사용자ID: {}, 사용자명: {}", roomId, userId, currentUserName);

        // 사용자를 활성 상태로 설정
        webSocketService.setUserActive(roomId, userId, true);

        // 메시지 읽음 처리 서비스 호출
        webSocketService.markMessagesAsRead(roomId, userId);

        // 읽음 상태 업데이트 알림 구성
        Long receiverId = webSocketService.getReceiverId(roomId, userId);

        Map<String, Object> readStatus = new HashMap<>();
        readStatus.put("type", "readStatus");
        readStatus.put("roomId", roomId);
        readStatus.put("reader", currentUserName);
        readStatus.put("readerId", userId);
        readStatus.put("timestamp", LocalDateTime.now());

        // 상대방에게 읽음 상태 업데이트 알림 전송
        messagingTemplate.convertAndSendToUser(
                String.valueOf(receiverId),
                "/queue/read-status",
                readStatus
        );
        log.info("읽음 상태 알림 전송 - 방ID: {}, 수신자ID: {}", roomId, receiverId);
    }

    @MessageMapping("/{roomId}/alarm-click")
    public void handleNotificationClick(@DestinationVariable Long roomId, MessageRequest messageRequest) {
        Long userId = messageRequest.getSenderId();
        String currentUserName = messageRequest.getSenderName();
        log.info("알림 클릭 처리 - 방ID: {}, 사용자ID: {}", roomId, userId);

        // 메시지 읽음 처리 서비스 호출
        webSocketService.markMessagesAsRead(roomId, userId);

        // 읽음 상태 업데이트 알림 구성
        Long receiverId = webSocketService.getReceiverId(roomId, userId);

        Map<String, Object> readStatus = new HashMap<>();
        readStatus.put("type", "readStatus");
        readStatus.put("roomId", roomId);
        readStatus.put("reader", currentUserName);
        readStatus.put("readerId", userId);
        readStatus.put("timestamp", LocalDateTime.now());

        // 상대방에게 읽음 상태 업데이트 알림 전송
        messagingTemplate.convertAndSendToUser(
                String.valueOf(receiverId),
                "/queue/read-status",
                readStatus
        );
        log.info("읽음 상태 알림 전송 - 방ID: {}, 수신자ID: {}", roomId, receiverId);
    }

    @MessageMapping("/{roomId}/leave")
    public void leaveChatRoom(@DestinationVariable Long roomId, MessageRequest messageRequest) {
        Long userId = messageRequest.getSenderId();

        // 사용자를 비활성 상태로 설정
        webSocketService.setUserActive(roomId, userId, false);
        log.info("사용자 채팅방 퇴장 - 방ID: {}, 사용자ID: {}", roomId, userId);
    }

    @MessageMapping("/{roomId}/user-activity")
    public void handleUserActivity(@DestinationVariable Long roomId, MessageRequest messageRequest) {
        // 기본 로그
        log.info("채팅방 활성 상태 - 방ID: {}, 사용자ID: {}, 상태: {}",
                roomId, messageRequest.getSenderId(), messageRequest.isActive());

        Long userId = messageRequest.getSenderId();
        String currentUserName = messageRequest.getSenderName();
        boolean isActive = messageRequest.isActive(); // 클라이언트에서 전송하는 활성 상태 값

        // 사용자 활성 상태 업데이트
        webSocketService.setUserActive(roomId, userId, isActive);

        if(isActive) {
            // 메시지 읽음 처리
            webSocketService.markMessagesAsRead(roomId, userId);

            // 읽음 상태 업데이트 알림 구성
            Long receiverId = webSocketService.getReceiverId(roomId, userId);

            Map<String, Object> readStatus = new HashMap<>();
            readStatus.put("type", "readStatus");
            readStatus.put("roomId", roomId);
            readStatus.put("reader", currentUserName);
            readStatus.put("readerId", userId);
            readStatus.put("timestamp", LocalDateTime.now());

            // 상대방에게 읽음 상태 업데이트 알림 전송
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(receiverId),
                    "/queue/read-status",
                    readStatus
            );
            log.info("활성화 상태에서 읽음 처리 알림 전송 - 방ID: {}, 수신자ID: {}", roomId, receiverId);
        }
    }
}