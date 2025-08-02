package com.example.Chatspringboot.domain.user.friend.model.friendDto;

import com.example.Chatspringboot.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;

public record FriendResponse (
        @Schema(description = "error code")
        ErrorCode description

){

}
