package com.example.Chatspringboot.domain.repository.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.*;

import java.security.Timestamp;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED) //버그 발생 가능성 방지
@Table(name =  "user_credentials")
public class UserCredentials { //forign key로 써  user_t_id를 관리
    @Id
    @OneToOne
    @JoinColumn(name = "user_t_id") //FK 컬럼 지정

    private User user;

    @Column(nullable = false)
    private String hashed_password;


}
