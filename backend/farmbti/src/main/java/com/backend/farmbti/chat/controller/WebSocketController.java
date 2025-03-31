package com.backend.farmbti.chat.controller;

import com.backend.farmbti.chat.dto.MessageRequest;
import com.backend.farmbti.chat.dto.MessageResponse;
import com.backend.farmbti.chat.exception.ChatErrorCode;
import com.backend.farmbti.chat.service.WebSocketService;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.security.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
@Tag(name = "WebSocket 채팅 컨트롤러", description = "실시간 채팅 메시지 처리를 위한 컨트롤러")
@RequiredArgsConstructor
public class WebSocketController {

    private final WebSocketService webSocketService;
    private final SecurityUtils securityUtils;
    private final SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/{roomId}/send")
    @SendTo("/topic/chat/{roomId}")
    public MessageResponse sendMessage(@DestinationVariable Long roomId, MessageRequest messageRequest) {

        if (messageRequest.getMessage().length() >= 1000) {
            throw new GlobalException(ChatErrorCode.MESSAGE_TO_LONG);
        }

        System.out.println(messageRequest.getSenderId());

        // 메시지 처리 로직
        MessageResponse messageResponse = webSocketService.saveAndGetMessage(roomId, messageRequest.getMessage(), messageRequest.getSenderId());

        //메시지 보내는 사람 즉, 로그인 한 사람
        String currentUserName = messageRequest.getSenderName();

        //메시지를 받는 사람 즉, 상대방
        String receiverUsername = webSocketService.getRecevierName(roomId, currentUserName);

        System.out.println("보내는 사람: " + currentUserName);
        System.out.println("받는 사람: " + receiverUsername);

        //알림 발송 로직
        Map<String, Object> notification = new HashMap<>();
        notification.put("sender", currentUserName); //보낸사람
        notification.put("timestamp", messageResponse.getSentAt());

        // 메시지를 받는 사람에게 알림 전송
        messagingTemplate.convertAndSendToUser(
                receiverUsername,
                "/queue/notifications",  // 사용자별 구독 경로
                notification
        );

        return messageResponse;
    }


}
