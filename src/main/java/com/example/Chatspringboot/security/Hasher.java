package com.example.Chatspringboot.security;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
public class Hasher {
    public String getHashingValue(String password) {
        try{
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(hash);

        }catch (NoSuchAlgorithmException e){ //없는 알고리즘 사용에 대해서 에러를 잡고자 사용하는 것
            throw new RuntimeException("Hash failed",e);

        }
    }
}
