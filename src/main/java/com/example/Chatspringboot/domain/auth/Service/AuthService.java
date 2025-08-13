package com.example.Chatspringboot.domain.auth.Service;

import com.auth0.jwt.JWT;
import com.example.Chatspringboot.common.exception.CustomException;
import com.example.Chatspringboot.common.exception.ErrorCode;
import com.example.Chatspringboot.domain.auth.Model.Request.CreateUserRequest;
import com.example.Chatspringboot.domain.auth.Model.Request.LoginUserRequest;
import com.example.Chatspringboot.domain.auth.Model.Response.CreateUserResponse;
import com.example.Chatspringboot.domain.auth.Model.Response.LoginUserResponse;
import com.example.Chatspringboot.domain.repository.Entity.User;
import com.example.Chatspringboot.domain.repository.Entity.UserCredentials;
import com.example.Chatspringboot.domain.repository.UserRepository;
import com.example.Chatspringboot.security.Hasher;
import com.example.Chatspringboot.security.JWTProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; //Lombok 라이브러리에서 제공하는 에너테이션, 로깅 기능을 자동으로 추가
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;


import java.sql.Timestamp;
import java.util.*;

//Lombok이란 java에 반복적인 코드를 줄여주는 라이브러리다.
//getter setter ToString @Builder
@Slf4j
@Service
@RequiredArgsConstructor //자동 bean 주입
public class AuthService {

    private final UserRepository userRepository;
    private final Hasher hasher;

    @Transactional(transactionManager = "createUserTransactionManager")
    public CreateUserResponse createUser(CreateUserRequest request) {
        Optional<User> user = userRepository.findByName(request.name());

        if(user.isPresent()) {
            //  TODO 에러
            log.error("USER_ALREADY_EXTISTS: {}", request.name()); //로그찍기
            throw new CustomException(ErrorCode.USER_ALREADY_EXTISTS);

        }
        try{
             User newUser = this.newUser(request.name());
             UserCredentials newCredentials =  this.newUserCredentials(request.password(),newUser);
             newUser.setCredentials(newCredentials);

             User savedUser = userRepository.save(newUser);

             if(savedUser == null) {
                 // TODO 에러처리
                 throw new CustomException(ErrorCode.UserSave_failed);


             }

        } catch (Exception e) {
            throw new CustomException(ErrorCode.UserSave_failed, e.getMessage());
            // TODO 에러
        }
        return new CreateUserResponse(request.name());
    }

    private User newUser(String name) {
        User newUser = User.builder()
                .name(name)
                .created_at(new Timestamp(System.currentTimeMillis()))
                .build();
        return newUser;
    }
    public String getUsernameFromToken(String token) { //토큰 값을 넘겨주면서 그 값을 기반으로 username값을 가져온다
            return JWTProvider.getUserFromtoken(token);
    }
    public Long getUserIdFromToken(String token) {
        return JWTProvider.getUserIdFromToken(token);
    }

    public LoginUserResponse Login(LoginUserRequest request) {
        Optional<User> user = userRepository.findByName(request.name());
        log.info("요청 받은 username: '{}'", request.name());

        if(!user.isPresent()) {
            log.error("NOT_EXIST_USER: {}", request.name());
            throw new CustomException(ErrorCode.NOT_EXIST_USER);

        }

        user.map(u ->{
             String hashedValue = hasher.getHashingValue(request.password());

             if(!u.getUsercredentials().getHashed_password().equals(hashedValue)) {
                //System.out.println(hashedValue + "일치하지 않는다");

                 throw new CustomException(ErrorCode.MIS_MATCH_PASSWORD);

             }
             System.out.println(hashedValue);
             return hashedValue;

        }).orElseThrow(()-> {
            throw new CustomException(ErrorCode.MIS_MATCH_PASSWORD);

        });
        //return new LoginUserResponse(ErrorCode.SUCCESS,"Token");

        //String token = JWTProvider.createRefreshToken(request.name());
        String token = JWTProvider.createFriendRefreshToken(user.get().getId(),user.get().getName());
        System.out.println(token);
        return new LoginUserResponse(ErrorCode.SUCCESS,token);

    }

    //해싱

    private UserCredentials newUserCredentials(String password, User user) {
        // TODO HASH
        String hashedValue = hasher.getHashingValue(password);
        UserCredentials cre = UserCredentials. //Lombok의 빌더 패턴으로 객체 생성.
                builder().
                user(user). //연결할 객체 설정
                hashed_password(hashedValue).
                build();
        return cre;



    }


}

