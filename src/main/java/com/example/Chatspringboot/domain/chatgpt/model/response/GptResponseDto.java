package com.example.Chatspringboot.domain.chatgpt.model.response;

import com.example.Chatspringboot.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;


@Schema(description = "gpt response")
public record GptResponseDto(
        @Schema(description = "ErrorCode")
        ErrorCode description,

        @Schema(description = "단어 리스트")
        List<GptResponseDto.wordlist> WordList

) {
        public static record wordlist(
                @Schema(description = "word name")
                String word_name,

                @Schema(description = "word detail")
                String detail


        ){}
}
