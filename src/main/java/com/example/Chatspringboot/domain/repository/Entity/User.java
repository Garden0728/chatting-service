package com.example.Chatspringboot.domain.repository.Entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Getter
@Builder
@AllArgsConstructor //모든 핑드 초기화 생성자 자동 생성
@NoArgsConstructor(access = AccessLevel.PROTECTED) //버그 발생 가능성 방지
@Table(name =  "user")
public class User {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "t_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private Timestamp created_at;
    //즉 필요한 조건일때 가져온다는 느낌.
    //fetch = FetchType.LAZY를 동작 시키지 않으면 UserCredentials도 같이 가져온다, user 하나 가져오는데 UserCredentials도 같이 가져옴,
    //fetch = FetchType.LAZY 쓰면 가져오지는 않는다 디비에서 데이터 값을 가져오지 않는다, jpa에서 기본적으로 프록시를 객체를 생성해서 참조만 가능하게 한다.
    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)  //Jpa 매핑 연관 관계 매핑이 동작하면서 , 연관된 엔티티 Crendential에서 user와 1대1 관계 user 필드가 외래기키를 가지고 있다, 즉 usercredential의 user가 연관관계의 주인 FK를 관리
    //CascadeType 동일한 작업 허용
    private UserCredentials usercredentials;

    public void setCredentials(UserCredentials credentials) {
        this.usercredentials = credentials;
    }

}
