package com.example.Chatspringboot.domain.repository;

import com.example.Chatspringboot.domain.repository.Entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    //List<Chat> findTop10BySenderOrReceiverOrderByTIDDesc(String sender, String receiver);

    List<Chat> findTop50BySenderOrReceiverOrderByTIDAsc(String sender, String receiver);

    //기본적으로 데이터를 찾오는 함수 리미트 10개를 줄거야 sender와 receiver에 대해서 웨어조건에 올 조건을 줄거야
    //TID에 대해서 Desc 조건을 줘서 데이터를 기져올거야
    @Query("SELECT c FROM Chat AS c WHERE  (c.sender = :sender AND c.receiver = :receiver) OR (c.sender = :receiver AND c.receiver = :sender) ORDER BY c.TID ASC ")
    List<Chat> findTop10Chats(@Param("sender") String sender, @Param("receiver") String receiver);

    @Query(
            value = "SELECT name FROM ( " +
                    "SELECT IF(sender = :user, receiver, sender) AS name, MAX(created_at) AS latest " +
                    "FROM Chat " +
                    "WHERE sender = :user OR receiver = :user " +
                    "GROUP BY name " +
                    ") AS sub " +
                    "ORDER BY sub.latest DESC",
            nativeQuery = true)
    List<String> findChatrecord(@Param("user") String user);


    //List<String> findChatrecord(@Param("user") String user);


}
