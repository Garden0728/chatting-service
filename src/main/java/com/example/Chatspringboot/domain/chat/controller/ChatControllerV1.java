package com.example.Chatspringboot.domain.chat.controller;
import com.example.Chatspringboot.domain.auth.Model.Request.CreateUserRequest;
import com.example.Chatspringboot.domain.auth.Model.Request.LoginUserRequest;
import com.example.Chatspringboot.domain.auth.Model.Response.CreateUserResponse;
import com.example.Chatspringboot.domain.auth.Model.Response.LoginUserResponse;
import com.example.Chatspringboot.domain.auth.Service.AuthService;
import com.example.Chatspringboot.domain.auth.Service.ChatServiceV1;
import com.example.Chatspringboot.domain.chat.model.response.ChatListResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Chat API", description = "V1 Chat API")
@RestController //해당 클래스가 REST API 컨트롤러임을 명시. //restController : 뷰를 반환하지 않고 항상 데이터를 반환한다.
@RequestMapping("/api/v1/chat") //모든 요청 앞에 /api/v1/auth가 붙음.
@RequiredArgsConstructor //Lombok이 final 필드인 ChatService를 자동으로 생성자 주입.
public class ChatControllerV1 {
    private final ChatServiceV1 chatServiceV1;

    @Operation(
            summary = "채팅리스트를 가져옵니다.",
            description = "가장 최근 10개의 리스트를 가져옵니다."
    )
    @GetMapping("/chat-list")
    public ChatListResponse chatList(
            @RequestParam("name") @Valid String to,
            @RequestParam("from") @Valid String from
    ){
        return chatServiceV1.chatList(from,to);
    }


}
