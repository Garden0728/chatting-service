package com.example.Chatspringboot.domain.user.model.friend.controller;

import com.example.Chatspringboot.domain.user.model.friend.service.FriendService;
import com.example.Chatspringboot.domain.user.model.friend.model.friendDto.FriendRequestListResponse;
import com.example.Chatspringboot.domain.user.model.friend.model.friendDto.FriendResponse;
import com.example.Chatspringboot.domain.user.model.friend.model.friendDto.FriendTakeResponse;
import com.example.Chatspringboot.security.JWTProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "friend  API", description = "V1 Friend API")
@Slf4j
@RestController
@RequestMapping("/api/v1/friend")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService friendService;
     @Operation(
            summary = "Friend Request",
            description = "User ID 기반으로 친구 신청"
    )
    @PostMapping("/add/{friendId}")
    public FriendResponse friendRequest(
            @PathVariable("friendId") Long targetID,
            @RequestHeader("Authorization") String authString
    ) {
         String token = JWTProvider.extractToken(authString);
         Long RequestId = JWTProvider.getUserIdFromToken(token);

         return friendService.friendRequestSave(RequestId,targetID);
    }
    @Operation(
            summary = "Friend Request list",
            description =  "User ID기반으로 친구요청 보낸 목록 및 받은 목록 리스트"
    )
    @GetMapping("/Take-Request-friend")
    public FriendRequestListResponse takeFriendRequestlist(
            @RequestHeader("Authorization") String authString
    ){
         String token = JWTProvider.extractToken(authString);
         Long UserID = JWTProvider.getUserIdFromToken(token);

         return friendService.GetFriendRequestList(UserID);
    }
    @Operation(
            summary = "Friend list",
            description = "User 기반으로 유저의 친구목록 리스트를 가져옴."
    )
    @GetMapping("/Take-FriendList")
    public FriendTakeResponse TakeFriendList(
            @RequestHeader("Authorization") String authString

    ){
         String token = JWTProvider.extractToken(authString);
         Long UserID = JWTProvider.getUserIdFromToken(token);

         return friendService.GetFriendList(UserID);
    }


}
