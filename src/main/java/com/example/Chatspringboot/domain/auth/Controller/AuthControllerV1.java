package com.example.Chatspringboot.domain.auth.Controller;


import com.example.Chatspringboot.domain.auth.Model.Request.CreateUserRequest;
import com.example.Chatspringboot.domain.auth.Model.Request.LoginUserRequest;
import com.example.Chatspringboot.domain.auth.Model.Response.CreateUserResponse;
import com.example.Chatspringboot.domain.auth.Model.Response.LoginUserResponse;
import com.example.Chatspringboot.domain.auth.Service.AuthService;
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
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth API", description = "V1 Auth API")
@RestController //해당 클래스가 REST API 컨트롤러임을 명시. //restController : 뷰를 반환하지 않고 항상 데이터를 반환한다.
@RequestMapping("/api/v1/auth") //모든 요청 앞에 /api/v1/auth가 붙음.
@RequiredArgsConstructor //Lombok이 final 필드인 authService를 자동으로 생성자 주입.
public class AuthControllerV1 {

    private final AuthService authService;

    //Swagger 문서에 표시될 API 설명.
    @Operation( //swagger사용 , swagger : Swagger는 RESTful API를 문서화하고, 테스트하고, 설계할 수 있는 도구 면 Swagger UI에서 자동으로 POST /api/v1/user//Create-user 경로가 문서화
                summary =  "새로운 유저를 생성합니다.", //간단한 설명
                description =  "새로운 유저 생성" //자세한 설명
    )
    @PostMapping("/create-user")
    public CreateUserResponse createUser(
        @RequestBody @Valid CreateUserRequest request //@RequestBody : Json 요청 데이터를 CreateUserRequest 객체로 맵핑 , @Vaild : 유효성 검사
    ){
        return authService.createUser(request);
    }
    @Operation(
            summary = "로그인 처리",
            description = "로그인을  진행합니다."
    )
    @PostMapping("/login")
    public LoginUserResponse login(
          @RequestBody @Valid LoginUserRequest request
    ){
        return authService.Login(request);
    }
    @Operation(
            summary = "get user name",
            description = "token을 기반으로 user를 가져옵니다."
    )
    @GetMapping("/verify-token/{token}")
    public String getUserFromtoken(
            @PathVariable String token     //PathVariable uri에 있는 토큰 값 가져옴

    ) {
        return authService.getUsernameFromToken(token);
    }




}
