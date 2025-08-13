package com.example.Chatspringboot.domain.chat.controller;

import com.example.Chatspringboot.domain.chat.service.ChatServiceV1;
import com.example.Chatspringboot.domain.chat.model.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
@Slf4j


public class WssControllerV1 {
    private final ChatServiceV1 chatServiceV1;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/message/{from}") //위 주소로
    @SendTo("/sub/chat")//클라이언트 요청
    public void receivedMessage(
            @DestinationVariable String from, //클라이언트가 보낸 경로에 from 부분을 피라미터로 가져온다.
            Message msg
    ) {
        log.info("Message Received -> From : {}, to: {}, msg : {}", from, msg.getTo(), msg.getFrom());
        chatServiceV1.saveChatMessage(msg);


        messagingTemplate.convertAndSend(
            "/sub/chat/" + msg.getTo(), // ex: /sub/chat/3
            msg
        );
         messagingTemplate.convertAndSend(
            "/sub/chat/" + msg.getFrom(), // ex: /sub/chat/3
            msg
        );
        //TODO -> MESSAGE SAVE
        //return msg;
    }
}
