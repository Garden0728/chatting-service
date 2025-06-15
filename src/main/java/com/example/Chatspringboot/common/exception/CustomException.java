package com.example.Chatspringboot.common.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException{
    private final CoderInterface coderInterface;
    public CustomException(CoderInterface coderInterface) {
        super(coderInterface.getMessage());
        this.coderInterface = coderInterface;
    }
    public CustomException(CoderInterface coderInterface, String message) {
        super(coderInterface.getMessage() + message);
        this.coderInterface = coderInterface;
    }

}

