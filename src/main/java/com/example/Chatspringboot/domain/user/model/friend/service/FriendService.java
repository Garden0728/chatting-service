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
import org.springframework.data.repository.query.Param;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class FriendService {
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;


    @Transactional(transactionManager = "createUserTransactionManager")
    public FriendResponse friendRequestSave(Long RequestId, Long targetID) {
        User RequestUser = userRepository.findById(RequestId)

                .orElseThrow(() -> {
                    log.error("NOT_EXIST_USER: {}", RequestId);
                    return new CustomException(ErrorCode.NOT_EXIST_USER); //성공으로 처리해주고 객체 반환후 함수 종료
                });
        User TargetUsr = userRepository.findById(targetID)

                .orElseThrow(() -> {
                    log.error("NOT_EXIST_USER: {}", targetID);
                    return new CustomException(ErrorCode.NOT_EXIST_USER); //400대 에러로 정상처리 안된걸로 함수 강제 종료후 에러 클라로 보냄
                });

        if (friendRepository.checkSaveFriend(RequestId, targetID)) {

            throw  new CustomException(ErrorCode.FRIEND_REQUEST_NOT_SAVE);
        }


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

    @Transactional(readOnly = true, transactionManager = "createUserTransactionManager")
    //나에게 온 요청중 아직 수락이 되지 않은 친구 요청
    public FriendRequestListResponse GetFriendRequestList(Long UserId) {
        List<Friend> receive = friendRepository.TakeFriendRequestList(UserId);
        List<Friend> sent = friendRepository.TakeFriendSendtList(UserId);


        List<FriendRequestListResponse.receiveList> receivedDtos = receive.stream()
                .map(f -> {
                    System.out.println(f.getUser().getName());
                    return new FriendRequestListResponse.receiveList(
                            f.getId(),
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
                                f.getId(),
                                f.getFriend().getName(),       // 상대 이름
                                f.getUser().getId(),           // 보낸 사람 ID
                                f.getFriend().getId(),         // 받은 사람 ID
                                f.getCreatedAt()
                        ))
                .toList();


        return new FriendRequestListResponse(ErrorCode.SUCCESS, receivedDtos, sendDtos);
    }

    @Transactional(readOnly = true, transactionManager = "createUserTransactionManager")
    public FriendTakeResponse GetFriendList(Long UserId) {
        User findUser = userRepository.findById(UserId)
                .orElseThrow(() -> {
                    log.error("NOT_EXIST_USER: {}", UserId);
                    return new CustomException(ErrorCode.NOT_EXIST_USER);
                });
        List<Friend> friendList = friendRepository.findAllAcceptedTrue(findUser);
        List<FriendTakeResponse.FriendInfo> FriendInfoList = friendList.stream()
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

    @Transactional(transactionManager = "createUserTransactionManager")
    public FriendTakeResponse ChangeFriendRequest_accept(Long UserId, Long FriendRequestId) {

        Friend friend = friendRepository.findById(FriendRequestId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.FRIEND_REQUEST_NO_FOUND));
        if (!friend.getFriend().getId().equals(UserId)) {
            throw new CustomException(ErrorCode.FRIEND_ACCEPT_NO_AUTHORITY);

        }
        int accept = friendRepository.acceptFriend(friend.getId(), UserId);
        if (accept == 0) {
            throw new CustomException(ErrorCode.FRIEND_REQUEST_NO_FOUND);
        }
        FriendTakeResponse updateUserFriendList = GetFriendList(UserId);
        FriendTakeResponse updateFriendList = GetFriendList(friend.getUser().getId());
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {

                messagingTemplate.convertAndSend("/sub/friend/" + friend.getUser().getId(), updateFriendList);
                messagingTemplate.convertAndSend("/sub/friend/" + friend.getFriend().getId(), updateUserFriendList);
                // 지금처럼 리스트 통째로 쏘고 싶으면 payload 대신 `update` 보내도 됨.
            }
        });

        return updateUserFriendList;

    }

}
