package com.example.Chatspringboot.domain.user.controller;


import com.example.Chatspringboot.domain.auth.Model.Request.CreateUserRequest;
import com.example.Chatspringboot.domain.auth.Model.Request.LoginUserRequest;
import com.example.Chatspringboot.domain.auth.Model.Response.CreateUserResponse;
import com.example.Chatspringboot.domain.auth.Model.Response.LoginUserResponse;
import com.example.Chatspringboot.domain.auth.Service.AuthService;
import com.example.Chatspringboot.domain.repository.UserRepository;
import com.example.Chatspringboot.domain.user.model.response.UserSearchResponse;
import com.example.Chatspringboot.domain.user.service.UserServiceV1;
import com.example.Chatspringboot.security.JWTProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User API", description = "V1 User API")
@RestController //해당 클래스가 REST API 컨트롤러임을 명시. //restController : 뷰를 반환하지 않고 항상 데이터를 반환한다.
@RequestMapping("/api/v1/user") //모든 요청 앞에 /api/v1/auth가 붙음.
@RequiredArgsConstructor //Lombok이 final 필드인 authService를 자동으로 생성자 주입.
public class UserControllerV1 {
    private final UserRepository userRepository;
    private final UserServiceV1 userServiceV1;


    @Operation(
            summary = "User Name List Search",
            description = "User Name을 기반으로 Like 검색 실행"
    )
    @GetMapping("/search/{name}")
    public UserSearchResponse searchUser( //헤더정보에 있는 토큰을 기반으로 정보를 가져옴.
            @PathVariable("name")String name,
            @RequestHeader("Authorization") String authString

    ){

        //Jwt 토큰의 해시값만 가져와야함
        String token = JWTProvider.extractToken(authString);
        String user= JWTProvider.getUserFromtoken(token);
        return userServiceV1.searchUser(name, user);
    }

   // public UserFriendRequestList

}
