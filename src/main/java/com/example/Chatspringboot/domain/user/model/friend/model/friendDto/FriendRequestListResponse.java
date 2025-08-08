package com.example.Chatspringboot.domain.user.model.friend.model.friendDto;

import com.example.Chatspringboot.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Friend Request list")
public record FriendRequestListResponse(
        @Schema(description = "error code")
        ErrorCode description,

        @Schema(description = " 유저 친구요청  받은  목록 리스트")
        List<FriendRequestListResponse.receiveList> UserList,

        @Schema(description = "유저가 친구요청 한 목록 리스트")
        List<FriendRequestListResponse.sendList> friendRequestList




) {
    public static record sendList(
            @Schema(description = "상대 유저 이름")
            String name,


            @Schema(description = "유저 아이디")
            Long sendID,

            @Schema(description = "요청 받은 유저 아이디")
            Long receiveID,

            @Schema(description = "요청 날짜")
            LocalDateTime createdAt
    ) {
    }

      public static record receiveList(
            @Schema(description = "상대 유저 이름")
            String name,

            @Schema(description = "상대 유저 아이디")
            Long sendID,

            @Schema(description = "유저 아이디")
            Long receiveID,

            @Schema(description = "요청 날짜")
            LocalDateTime createdAt
    ) {
    }
}

