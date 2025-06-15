package com.example.Chatspringboot.domain.auth.Service;


import com.example.Chatspringboot.domain.chat.model.Message;
import com.example.Chatspringboot.domain.chat.model.response.ChatListResponse;
import com.example.Chatspringboot.domain.repository.ChatRepository;
import com.example.Chatspringboot.domain.repository.Entity.Chat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ChatServiceV1 {


    private final ChatRepository chatRepository;

    public ChatListResponse chatList(String from, String to) {
        List<Chat> chats = chatRepository.findTop10Chats(from, to);
        //Entity -> Dto 엔티티값을 메세지 형태로 맞춰
        List<Message> res = chats.stream()
                .map(chat -> new Message(chat.getReceiver(), chat.getSender(),chat.getMessage()))
                .collect(Collectors.toList());


        return new ChatListResponse(res);
    }
    @Transactional(transactionManager = "createChatTransactionManager") //configuration을 따로 관리한다면 이런식으로 따로 어노테이션을 붙여줘야 함.
    public void saveChatMessage(Message msg) {
        Chat chat = Chat.builder().
                sender(msg.getFrom()).
                receiver(msg.getTo()).
                message(msg.getMessage()).
                created_at(new Timestamp(System.currentTimeMillis())).
                build();


                chatRepository.save(chat);
    }
}
