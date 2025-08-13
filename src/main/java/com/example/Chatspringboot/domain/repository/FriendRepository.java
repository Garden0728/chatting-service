package com.example.Chatspringboot.domain.repository;

import com.example.Chatspringboot.domain.repository.Entity.Friend;
import com.example.Chatspringboot.domain.repository.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            
            UPDATE Friend f
                       SET f.accepted = true
                       WHERE f.id = :friendId
                            AND f.friend.id = :userId
                            AND f.accepted = false
            """)
    int  acceptFriend(@Param("friendId") Long friendId, @Param("userId") Long userId);





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


     @Query("""
            SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END
            from Friend f
            where (f.user.id = :userID and  f.friend.id = :friendID AND f.accepted = true)
                  OR (f.user.id = :friendID and  f.friend.id = :userID AND f.accepted = true)
        
            """)
    boolean checkSaveFriend(@Param("userID")Long userId,@Param("friendID") Long FriendId);

}
