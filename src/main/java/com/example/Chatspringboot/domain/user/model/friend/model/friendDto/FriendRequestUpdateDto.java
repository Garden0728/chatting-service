package com.example.Chatspringboot.domain.user.model.friend.model.friendDto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record FriendRequestUpdateDto(
        @Schema(description = "sub을 구독한 클라이언트에 보내는 친구요청 dto")
        Long senderId,

        String senderName,

        Long receiverId,

        LocalDateTime createdAt



) {
}
