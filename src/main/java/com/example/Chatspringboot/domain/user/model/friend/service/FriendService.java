package com.example.Chatspringboot.domain.user.model.friend.service;

import com.example.Chatspringboot.common.exception.CustomException;
import com.example.Chatspringboot.common.exception.ErrorCode;
import com.example.Chatspringboot.domain.repository.Entity.Friend;
import com.example.Chatspringboot.domain.repository.Entity.User;
import com.example.Chatspringboot.domain.repository.FriendRepository;
import com.example.Chatspringboot.domain.repository.UserRepository;
import com.example.Chatspringboot.domain.user.model.friend.model.friendDto.FriendRequestListResponse;
import com.example.Chatspringboot.domain.user.model.friend.model.friendDto.FriendRequestUpdateDto;
import com.example.Chatspringboot.domain.user.model.friend.model.friendDto.FriendResponse;
import com.example.Chatspringboot.domain.user.model.friend.model.friendDto.FriendTakeResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class FriendService {
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public FriendResponse friendRequestSave(Long RequestId, Long targetID) {
        User RequestUser = userRepository.findById(RequestId)

                .orElseThrow(() -> {
                    log.error("NOT_EXIST_USER: {}", RequestId);
                    return new CustomException(ErrorCode.NOT_EXIST_USER);
                });
        User TargetUsr = userRepository.findById(targetID)

                .orElseThrow(() -> {
                    log.error("NOT_EXIST_USER: {}", targetID);
                    return new CustomException(ErrorCode.NOT_EXIST_USER);
                });


        //log.error("NOT_EXIST_USER: {}",targetID);
        //.orElseThrowthrow new CustomException(ErrorCode.NOT_EXIST_USER);

        Friend friend = Friend.builder()
                .user(RequestUser)
                .friend(TargetUsr)
                .accepted(false)
                .createdAt(LocalDateTime.now())
                .build();

        friendRepository.save(friend);

        FriendRequestUpdateDto dto = new FriendRequestUpdateDto(
                RequestUser.getId(),
                RequestUser.getName(),
                TargetUsr.getId(),
                LocalDateTime.now()
        );

        messagingTemplate.convertAndSend(
                "/sub/friend/" + TargetUsr.getId(), dto);

        return new FriendResponse(ErrorCode.FriendAddRequest);
    }

    //나에게 온 요청중 아직 수락이 되지 않은 친구 요청
    public FriendRequestListResponse GetFriendRequestList(Long UserId) {
        List<Friend> receive = friendRepository.TakeFriendRequestList(UserId);
        List<Friend> sent = friendRepository.TakeFriendSendtList(UserId);


        List<FriendRequestListResponse.receiveList> receivedDtos = receive.stream()
        .map(f -> {
            System.out.println(f.getUser().getName());
            return new FriendRequestListResponse.receiveList(
                    f.getUser().getName(),       // 상대 이름
                    f.getUser().getId(),           // 보낸 사람 ID
                    f.getFriend().getId(),         // 받은 사람 ID
                    f.getCreatedAt()
            );
        })
        .toList();

        List<FriendRequestListResponse.sendList> sendDtos = sent.stream()
                .map(f ->
                        new FriendRequestListResponse.sendList(
                                f.getFriend().getName(),       // 상대 이름
                                f.getUser().getId(),           // 보낸 사람 ID
                                f.getFriend().getId(),         // 받은 사람 ID
                                f.getCreatedAt()
                        ))
                .toList();


        return new FriendRequestListResponse(ErrorCode.SUCCESS, receivedDtos,sendDtos);
    }
    public FriendTakeResponse GetFriendList(Long UserId) {
        User findUser = userRepository.findById(UserId)
        .orElseThrow(() -> {
                    log.error("NOT_EXIST_USER: {}", UserId);
                    return new CustomException(ErrorCode.NOT_EXIST_USER);
        });
         List<Friend> friendList = friendRepository.findAllAcceptedTrue(findUser);
         List<FriendTakeResponse.FriendInfo> FriendInfoList  = friendList.stream()
                 .map(f -> {
                     User friendUser = f.getUser().equals(findUser) ? f.getFriend() : f.getUser();
                     System.out.println(friendUser.getId());
                      System.out.println(friendUser.getName() + "친구");
                     return new FriendTakeResponse.FriendInfo(
                             friendUser.getId(),
                             friendUser.getName()
                            // f.getCreatedAt()

                     );
                 })
                .toList();
         return new FriendTakeResponse(ErrorCode.SUCCESS, FriendInfoList);

    }

}
