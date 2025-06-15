package com.example.Chatspringboot.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration //spring 설정 클래스
@EnableWebSocketMessageBroker //websSocket 기능 활성화 //브러우저와 서버간에 실시간 양방향 통신을 할 수 있게 해준다.
//@RequiredArgsConstructor //Lombok을 사용해 final 필드나 @NonNull 필드를 자동으로 주입받는 생성자를 만들어줍니다.
//websocket 서버 구성, 핸들러 등록 클라이언트의 연결을 받을 경로를 설정하는 역할을 한다.
public class WssConfig implements WebSocketMessageBrokerConfigurer { //webSocketConfigurer webscoket 관련 설정 커스터마이징 ||  wws : TLs or ssl 로 암호화된 websocket 연결


    //PUB/SUB에 대해서 어떤 경로로 지정 할지 명시
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/sub"); //응답을 내려주는 경로
        registry.setApplicationDestinationPrefixes("/pub");
    }
    @Override //웹 소켓 통신에 대해서 연결되는 기본적인  베이스 값
    public void registerStompEndpoints(StompEndpointRegistry register) {
        register.addEndpoint("/ws-stomp")
                .setAllowedOrigins("*");
                //.withSockJS(); 이 옵셥은  클라이언트가 웹소켓을 사용 할 수 없는 환경에 대해서 서버 간 웹소켓 통신에 대해서 대체제로서 구현을 해주는 방어로직
                //프록시 or 방화벽 차단 or 브라우저 버전이 낮은경우 소켓을 통해서 통신을 하는게 아닌 롱폴링 같은 형태로서 통신을 웹소켓을 간략하게 구현을 해주는 정도의 옵션

    }
    /*@Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) { //기본적으러 웹소켓에 대해서 등록을 해주는 함수
        registry.addHandler(null,"ws/v1/chat")//어떤 웹 소켓을 통해서 path를 받을거냐 : "ws/v1/chat //실질적으로 사용하지 않을거라 HANDLE 설정 안 함.
                .setAllowedOrigins("*");//
    }*/
}
