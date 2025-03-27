package com.backend.farmbti.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // WebSocket 메시지 브로커 기능 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");  // '/topic'으로 시작하는 메시지를 메시지 브로커가 처리
        config.setApplicationDestinationPrefixes("/chat");  // 클라이언트에서 서버로 메시지 전송 시 사용할 접두사
        config.setUserDestinationPrefix("/user");  // 사용자별 메시지 전송을 위한 접두사 설정 (1:1 알림을 위해)
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/gs-guide-websocket") //websocket endpoint
                .setAllowedOrigins("*")
                .withSockJS();  // SockJS 지원 추가;  // CORS 설정 (필요에 따라 조정)
    }

    //securityUtils를 websocket 애서도 통신해주기 위한 함수
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {

    }

}
