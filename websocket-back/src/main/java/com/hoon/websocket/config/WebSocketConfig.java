package com.hoon.websocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class StompConfig  implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        System.out.println("StompConfig.configureMessageBroker");
        // 클라이언트가 구독하는 엔드포인트 설정
        config.enableSimpleBroker("/topic", "/queue");
        // 클라이언트가 메시지를 보낼 때 사용하는 prefix 설정
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("StompConfig.registerStompEndpoints");
        // WebSocket 연결 엔드포인트 설정
        registry.addEndpoint("/ws") // 클라이언트는 ws://localhost:8080/ws로 연결
                .setAllowedOriginPatterns("*") // CORS 허용
                .withSockJS() // SockJS를 사용하여 WebSocket이 지원되지 않는 환경에서도 작동
        ;
    }
}
