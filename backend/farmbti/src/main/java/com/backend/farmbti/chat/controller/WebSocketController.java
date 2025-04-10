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

        if (messageRequest.getMessage().length() >= 2000) {
            throw new GlobalException(ChatErrorCode.MESSAGE_TO_LONG);
        }

        System.out.println(messageRequest.getSenderId());

        // 메시지 처리 로직
        MessageResponse messageResponse = webSocketService.saveAndGetMessage(roomId, messageRequest.getMessage(), messageRequest.getSenderId());

        //메시지 보내는 사람 사즉, 로그인 한 람
        String currentUserName = messageRequest.getSenderName();

        //메시지를 받는 사람 즉, 상대방
        String receiverUsername = webSocketService.getRecevierName(roomId, currentUserName);

        System.out.println("보내는 사람: " + currentUserName);
        System.out.println("받는 사람: " + receiverUsername);

        // 사용자 이름 대신 ID를 가져오는 메소드를 사용해야 함
        Long senderId = messageRequest.getSenderId();

        // 이 부분을 수정: getRecevierName 대신 getReceiverId 메소드 필요
        Long receiverId = webSocketService.getReceiverId(roomId, senderId);

        // 알림 발송 로직
        Map<String, Object> notification = new HashMap<>();
        notification.put("sender", currentUserName);
        notification.put("senderId", senderId); // ID도 함께 전송
        notification.put("timestamp", messageResponse.getSentAt());
        notification.put("roomId", roomId);

        // 이 부분을 수정: 사용자 이름 대신 ID로 전송
        try {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(receiverId), // ID를 문자열로 변환
                    "/queue/notifications",
                    notification
            );
            System.out.println("알림 전송 성공!");
        } catch (Exception e) {
            System.out.println("알림 전송 실패: " + e.getMessage());
            e.printStackTrace();
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
            }
        }


        return messageResponse;
    }

    /**
     * 사용자가 모든 채팅방을 한번에 구독하기 위한 메소드
     * @param request 구독 요청 객체 (사용자 ID, 사용자 이름 포함)
     */
    @MessageMapping("/subscribe-all-rooms")
    public void subscribeAllRooms(MessageRequest request) {
        Long userId = request.getSenderId();
        String username = request.getSenderName();

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
                username,
                "/queue/subscription-result",
                subscriptionResult
        );
    }

    /**
     * 특정 채팅방 입장 시 메시지 읽음 처리를 위한 메소드
     * @param roomId 채팅방 ID
     * @param messageRequest 읽음 처리 요청 정보
     */
    @MessageMapping("/{roomId}/enter")
    public void enterChatRoom(@DestinationVariable Long roomId, MessageRequest messageRequest) {
        Long userId = messageRequest.getSenderId();
        String currentUserName = messageRequest.getSenderName();

        // 사용자를 활성 상태로 설정
        webSocketService.setUserActive(roomId, userId, true);

        // 메시지 읽음 처리 서비스 호출
        webSocketService.markMessagesAsRead(roomId, userId);

        // 읽음 상태 업데이트 알림 구성
        String receiverUsername = webSocketService.getRecevierName(roomId, currentUserName);
        Map<String, Object> readStatus = new HashMap<>();
        readStatus.put("type", "readStatus");
        readStatus.put("roomId", roomId);
        readStatus.put("reader", currentUserName);
        readStatus.put("timestamp", LocalDateTime.now());


        // 상대방에게 읽음 상태 업데이트 알림 전송
        messagingTemplate.convertAndSendToUser(
                receiverUsername,
                "/queue/read-status",
                readStatus
        );
    }

    /**
     * 알림 클릭 시 메시지 읽음 처리를 위한 메소드
     * @param roomId 채팅방 ID
     * @param messageRequest 읽음 처리 요청 정보
     */
    @MessageMapping("/{roomId}/alarm-click")
    public void handleNotificationClick(@DestinationVariable Long roomId, MessageRequest messageRequest) {
        Long userId = messageRequest.getSenderId();
        String currentUserName = messageRequest.getSenderName();

        // 메시지 읽음 처리 서비스 호출
        webSocketService.markMessagesAsRead(roomId, userId);

        // 읽음 상태 업데이트 알림 구성
        String receiverUsername = webSocketService.getRecevierName(roomId, currentUserName);
        Map<String, Object> readStatus = new HashMap<>();
        readStatus.put("type", "readStatus");
        readStatus.put("roomId", roomId);
        readStatus.put("reader", currentUserName);
        readStatus.put("timestamp", LocalDateTime.now());

        // 상대방에게 읽음 상태 업데이트 알림 전송
        messagingTemplate.convertAndSendToUser(
                receiverUsername,
                "/queue/read-status",
                readStatus
        );
    }

    // 새로운 메소드 추가 - 채팅방 나갈 때 호출
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
        }
    }



}
