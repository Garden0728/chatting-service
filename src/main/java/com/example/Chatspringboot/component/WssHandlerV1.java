package com.example.Chatspringboot.component;


import com.example.Chatspringboot.domain.chat.model.Message;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class WssHandlerV1 extends TextWebSocketHandler{
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage msg)  { //wssconfig에 ws/v1/chat (path)으로 들어오는 모든 요청은 해당 텍스트를 탄다.
            try{


                String payload = msg.getPayload();
                Message message = objectMapper.readValue(payload, Message.class);

                //1. DB에 있는 데이터 인지 [from, to]
                //2. 채팅 메시지 데이터 저장
                session.sendMessage(new TextMessage(payload));
            } catch (Exception e) {

            }
    }
}
