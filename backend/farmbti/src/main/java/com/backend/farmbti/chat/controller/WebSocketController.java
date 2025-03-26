package com.backend.farmbti.chat.controller;

import com.backend.farmbti.chat.dto.MessageResponse;
import com.backend.farmbti.chat.service.WebSocketService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Controller
@Tag(name = "WebSocket 채팅 컨트롤러", description = "실시간 채팅 메시지 처리를 위한 컨트롤러")
@RequiredArgsConstructor
public class WebSocketController {

    private final WebSocketService webSocketService;

    @MessageMapping("/{roomId}/send")
    @SendTo("/topic/chat/{roomId}")
    public MessageResponse sendMessage(@DestinationVariable Long roomId, String message) {

        // 메시지 처리 로직
        MessageResponse messageResponse = webSocketService.saveAndGetMessage(roomId, message);

        return messageResponse;
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
