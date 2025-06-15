package com.example.Chatspringboot.domain.user.service;

import com.example.Chatspringboot.common.exception.ErrorCode;
import com.example.Chatspringboot.domain.repository.UserRepository;
import com.example.Chatspringboot.domain.user.model.response.UserSearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceV1 {
    private final UserRepository userRepository;

    public final UserSearchResponse searchUser(String name, String user) {
        System.out.println("name: " + name);
        System.out.println("user: " + user);

        List<String> names = userRepository.findNameByNameMatch(name, user);
        System.out.println("name list : " + names);

        return new UserSearchResponse(ErrorCode.SUCCESS, names);
    }
}
