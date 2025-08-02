package com.example.Chatspringboot.domain.repository;

import com.example.Chatspringboot.domain.repository.Entity.Friend;
import com.example.Chatspringboot.domain.repository.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByUser(User user);//유저가 친구 요청한 친구 리스트
    List<Friend> findByFriendAndAcceptedFalse(User user); //요청 수락 되지 않은 친구 요청//
   // List<Friend> findByUserAndAcceptedTrue(User user); //친구
   // List<Friend> findByFriendAndAcceptedTrue(User Friend);


    @Query("SELECT f FROM Friend f WHERE (f.user = :user OR f.friend = :user) AND f.accepted = true")
    List<Friend> findAllAcceptedTrue(@Param("user") User user);

    @Query("""
                    SELECT f
                    FROM Friend f
                    WHERE 
                        f.friend.id = :userid
                        AND f.accepted = false
                    ORDER BY f.createdAt DESC 
            """)
    List<Friend> TakeFriendRequestList(@Param("userid") Long UserId);

     @Query("""
                    SELECT f
                    FROM Friend f
                    WHERE 
                        f.user.id = :userid
                        AND f.accepted = false
                    ORDER BY f.createdAt DESC 
            """)
    List<Friend> TakeFriendSendtList(@Param("userid") Long UserId);




}
