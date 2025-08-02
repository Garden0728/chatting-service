package com.example.Chatspringboot.common.exception;


import com.example.Chatspringboot.domain.repository.Entity.Friend;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter

public enum ErrorCode implements CoderInterface{
    SUCCESS(0, "SUCCESS"),

    USER_ALREADY_EXTISTS(-1,"SKR"),

    UserSave_failed(-2,"USER_save_failed"),

    NOT_EXIST_USER(-3,"NOT_EXIST_USER"),

    MIS_MATCH_PASSWORD(-4,"MIS_MATCH_PASSWORD"),

    TOKEN_IS_INVALID(-200,"token is invalid"),

    ACCESS_TOKEN_IS_NOT_EXPIRED(-201,"token is not expired"),

    TOKEN_EXPIRED(-202,"token is expired"),

    FriendAddRequest(-300,"SUCCESS_FRIEND_Request_ADD");



    private final Integer code;
    private final String message;
}
