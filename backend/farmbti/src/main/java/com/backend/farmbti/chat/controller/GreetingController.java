package com.backend.farmbti.chat.controller;

import com.backend.farmbti.chat.dto.Greeting;
import com.backend.farmbti.chat.dto.HelloMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class GreetingController {
    @MessageMapping("/hello")  // '/chat/hello'로 들어오는 메시지 처리
    @SendTo("/topic/greetings")  // 처리 결과를 '/topic/greetings'로 전송
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000);  // 처리 지연 시간 시뮬레이션 (1초)
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
        // HTML 이스케이프 처리로 보안 강화 (XSS 방지)
    }
}
