package com.backend.farmbti.chat.config;

import com.backend.farmbti.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker  // WebSocket 메시지 브로커 기능 활성화
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider;  // JWT 토큰 처리를 위한 프로바이더 주입

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // '/topic'과 '/queue'로 시작하는 메시지를 메시지 브로커가 처리하도록 설정
        config.enableSimpleBroker("/topic", "/queue");

        // 클라이언트에서 서버로 메시지 전송 시 사용할 접두사 설정
        config.setApplicationDestinationPrefixes("/chat");

        // 사용자별 메시지 전송을 위한 접두사 설정 (1:1 알림을 위해)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결 엔드포인트 등록
        registry.addEndpoint("/gs-guide-websocket")
                .setAllowedOrigins("http://localhost:18081", "http://localhost:3000", "http://j12d209.p.ssafy.io") // CORS 설정 (필요에 따라 조정)
                .withSockJS();  // SockJS 지원 추가 (브라우저 호환성을 위해)
    }
}