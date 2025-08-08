package com.example.Chatspringboot.domain.user.model.friend.model.friendDto;


import com.example.Chatspringboot.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record FriendTakeResponse (
        @Schema(description = "error code")
        ErrorCode description,

        @Schema(description = "친구 리스트")
        List<FriendInfo> FriendList

){
        public static record FriendInfo (
                Long id,
                String name
               // LocalDateTime CreatedAt

        ){}
}
