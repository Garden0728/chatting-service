package com.example.Chatspringboot.domain.repository;

import com.example.Chatspringboot.domain.repository.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    boolean existsByName(String name);

    // TODO
    //Locate 특정 필드에서 패턴이 일치하는 인덱스의 위치를 반환.
    // LOWER 대소문자 상관 없이 pattern이 포함되어있는지 확인
    @Query("SELECT u FROM User u WHERE u.name LIKE %:name% AND u.name <> :user")

    List<User> findNameByNameMatch(@Param("name")String name,@Param("user")String user);

}
