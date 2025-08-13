package com.example.Chatspringboot.domain.chat.model.response;
import com.example.Chatspringboot.common.exception.ErrorCode;
import com.example.Chatspringboot.domain.chat.model.Message;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.*;

@Schema(description = "Chatting Record UserList")
public record ChatRecordUserResponse(
        @Schema(description = "error code")
        ErrorCode description,

        @Schema(description = "이름")
        List<String> name
) {

}
