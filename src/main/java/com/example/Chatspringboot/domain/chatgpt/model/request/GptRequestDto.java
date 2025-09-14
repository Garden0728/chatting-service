package com.example.Chatspringboot.domain.chatgpt.model.request;

import com.example.Chatspringboot.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "gpt request")
public record GptRequestDto(
        ErrorCode description,
        String detail
) {
}
