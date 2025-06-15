package com.example.Chatspringboot.domain.auth.Model.Request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
@Schema(description = "Login 요청")
public record LoginUserRequest (
    @Schema(description = "유저 이름")
        @NotBlank //문자열 필드가 널이 아니고 공백인지 아닌지 검사
        @NotNull
        String name,

        @Schema(description = "유저 비밀번호")
        @NotBlank
        @NotNull
        String password
){}
