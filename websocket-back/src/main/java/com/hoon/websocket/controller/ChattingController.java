package com.hoon.websocket.controller;

import com.hoon.websocket.dto.SocketMessageDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class ChattingController {
    @MessageMapping("/chat/send") // 클라이언트가 메시지를 보낼 때 사용하는 경로 (/app/chat/send)
    @SendTo("/topic/public") // 클라이언트가 구독하는 주제 (/topic/public)
    public SocketMessageDto sendMessage(SocketMessageDto socketMessageDto) {
        System.out.println("Received message: " + socketMessageDto);
        return socketMessageDto; // 모든 구독자에게 메시지 전달
    }
}
