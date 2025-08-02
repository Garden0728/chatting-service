package com.example.Chatspringboot.domain.user.service;

import com.example.Chatspringboot.common.exception.ErrorCode;
import com.example.Chatspringboot.domain.repository.Entity.User;
import com.example.Chatspringboot.domain.repository.UserRepository;
import com.example.Chatspringboot.domain.user.model.Dto.UserSearchDto;
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
       // System.out.println("name: " + name);
       // System.out.println("user: " + user);

        List<User> users = userRepository.findNameByNameMatch(name, user);
        List<UserSearchDto> userSearchDtos = users.stream()
                .map(u-> new UserSearchDto(u.getId(),u.getName()))
                .toList();
        //System.out.println("name list : " + names);

        return new UserSearchResponse(ErrorCode.SUCCESS, userSearchDtos);
    }
}
