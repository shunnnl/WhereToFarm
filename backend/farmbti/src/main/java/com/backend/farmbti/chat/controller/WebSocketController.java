package com.backend.farmbti.chat.controller;

import com.backend.farmbti.chat.dto.MessageResponse;
import com.backend.farmbti.chat.exception.ChatErrorCode;
import com.backend.farmbti.chat.service.WebSocketService;
import com.backend.farmbti.common.exception.GlobalException;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Tag(name = "WebSocket 채팅 컨트롤러", description = "실시간 채팅 메시지 처리를 위한 컨트롤러")
@RequiredArgsConstructor
public class WebSocketController {

    private final WebSocketService webSocketService;

    @MessageMapping("/{roomId}/send")
    @SendTo("/topic/chat/{roomId}")
    public MessageResponse sendMessage(@DestinationVariable Long roomId, String message) {

        if (message.length() >= 1000) {
            throw new GlobalException(ChatErrorCode.MESSAGE_TO_LONG);
        }

        // 메시지 처리 로직
        MessageResponse messageResponse = webSocketService.saveAndGetMessage(roomId, message);

        return messageResponse;
    }

}
