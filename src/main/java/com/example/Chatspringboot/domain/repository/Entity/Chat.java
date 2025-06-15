package com.example.Chatspringboot.domain.repository.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;

//chatting 관련 저장 엔티티
@Entity
@Getter
@Builder
@AllArgsConstructor //모든 핑드 초기화 생성자 자동 생성
@NoArgsConstructor(access = AccessLevel.PROTECTED) //버그 발생 가능성 방지
@Table(name =  "chat")
public class Chat {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "t_id")
    private Long TID;

    @Column
    private String sender;

    @Column
    private String receiver;

    @Column
    private String message;
    @Column
    private  Timestamp created_at;
}
