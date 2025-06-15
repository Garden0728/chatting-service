package com.example.Chatspringboot.domain.auth.Model.Response;

import com.example.Chatspringboot.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "로그인 성공 response")
public record LoginUserResponse (
         @Schema(description = "error code")
         ErrorCode description,

         @Schema(description = "jwt token")
         String token


){}
