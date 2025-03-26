package com.backend.farmbti.chat.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Controller
@Tag(name = "WebSocket 채팅 컨트롤러", description = "실시간 채팅 메시지 처리를 위한 컨트롤러")
@RequiredArgsConstructor
public class WebSocketController {

    @MessageMapping("/{roomId}/send")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessageDto sendMessage(@DestinationVariable Long roomId, ChatMessageDto message) {
        message.setTimestamp(LocalDateTime.now());
        // 메시지 저장 로직 추가
        return message;
    }


    @MessageMapping("/{roomId}/typing")
    @SendTo("/topic/chat/{roomId}/typing")
    public void sendTypingStatus() {

    }

    @MessageMapping("/room/{roomId}/read")
    @SendTo("/topic/room/{roomId}/read")
    public void sendReadReceipt() {

    }

    @SubscribeMapping("/room/{roomId}")
    public void subscribeRoom() {

    }

    @MessageMapping("/status")
    @SendTo("/topic/status")
    public void updateUserStatus() {

    }

}
