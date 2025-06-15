package com.example.Chatspringboot.domain.auth.Model.Request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "User를 생성합니다.")
public record CreateUserRequest ( //record 불변객체 문법 클래스 특징 : 불변(값 변경 불가), 생성자, getter, equals, hascode, tostring 자동 생성 , 거의 Dto랑 같은 용도로 사용함

        @Schema(description = "유저 이름")
        @NotBlank //문자열 필드가 널이 아니고 공백인지 아닌지 검사
        @NotNull
        String name,

        @Schema(description = "유저 비밀번호")
        @NotBlank
        @NotNull
        String password


){}
