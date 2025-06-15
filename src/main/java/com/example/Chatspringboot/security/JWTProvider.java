package com.example.Chatspringboot.security;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.AlgorithmMismatchException;
import com.auth0.jwt.exceptions.InvalidClaimException;
import com.auth0.jwt.exceptions.SignatureGenerationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.Chatspringboot.common.Constants.Constants;
import com.example.Chatspringboot.common.exception.CustomException;
import com.example.Chatspringboot.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Date;

@Slf4j
@Component

//기본적으로 환경변수 값을 받을 수 있는 구조

//refresh_token을 이용해서 보안적으로 더 활성화 시키는게 좋다.
public class JWTProvider {


    private static String secretKey;
    private static String refreshSecretKey;
    private static Long tokenTimeForMinute;
    private static Long refreshTokenTimeForMinute;

    @Value("${token.secret-key}")
    public void setSecretKey(String secretKey) {
            JWTProvider.secretKey = secretKey;
    }
     @Value("${token.refresh-secret-key}")
    public void setRefreshSecretKey(String refreshSecretKey) {
            JWTProvider.refreshSecretKey = refreshSecretKey;
    }
    @Value("${token.token-time}")
    public void setTokenTimeForMinute(Long tokenTimeForMinute) {
            JWTProvider.tokenTimeForMinute = tokenTimeForMinute;
    }
    @Value("${token.refresh-token-time}")
    public void setRefreshTokenTimeForMinute(Long refreshTokenTimeForMinute) {
            JWTProvider.refreshTokenTimeForMinute = refreshTokenTimeForMinute;
    }
    public static String createToken(String name) {
        return JWT.create()
                .withSubject(name)
                .withIssuedAt(new Date()) //언제 발급이 되었는지
                .withExpiresAt(new Date(System.currentTimeMillis() + tokenTimeForMinute * Constants.ON_MINUSTE_TOS_MILLIS)) //언제 이게 exprire 되는지 //만료
                .sign(Algorithm.HMAC256(secretKey)); //어떤 암호화 알고리즘을 사용을 할거냐.
        //안위적으로 Builder 패턴을 사용하게 된다.


    }
    public static String createRefreshToken(String name) { // 추가 적인 필드를 추가 가능 대신에 형식은 맞춰라
        return JWT.create()
                .withSubject(name)
                .withIssuedAt(new Date()) //언제 발급이 되었는지
                .withExpiresAt(new Date(System.currentTimeMillis() + refreshTokenTimeForMinute * Constants.ON_MINUSTE_TOS_MILLIS)) //언제 이게 exprire 되는지
                .sign(Algorithm.HMAC256(refreshSecretKey)); //어떤 암호화 알고리즘을 사용을 할거냐.
        //안위적으로 Builder 패턴을 사용하게 된다.


    }
    public static DecodedJWT checkTokenForRefresh(String token) { //ACCESS 토큰이 정상적으로 만료가 되어있어야만 정상적으로 동작
        try{
                DecodedJWT decoded = JWT.require(Algorithm.HMAC256(secretKey)).build().verify(token); //secretKey기반으로 token값을 디코딩을 해봐라
                //verify가 정상적으로 됐다면 expire이 제대로 되지 않았다.

                log.error("token must be expired : {}",decoded.getSubject());
                throw new CustomException(ErrorCode.ACCESS_TOKEN_IS_NOT_EXPIRED);


        }catch (AlgorithmMismatchException | SignatureGenerationException | InvalidClaimException e){
            throw new CustomException(ErrorCode.TOKEN_IS_INVALID);

        }catch (TokenExpiredException e){ //tokenexpried되어있다면 정상
                return JWT.decode(token);

        }
    }

    public static DecodedJWT decodedAccessToken(String token) { //AccessToken에 대해서 decode
        return decodeTokenAfterVerify(token, secretKey);
    }

    private static DecodedJWT decodeTokenAfterVerify(String token, String key) {//정상적으로 Verify이 되는것을 가정 동작
        try{
               return JWT.require(Algorithm.HMAC256(secretKey)).build().verify(token);
        }catch (AlgorithmMismatchException | SignatureGenerationException | InvalidClaimException e){
                throw new CustomException(ErrorCode.TOKEN_IS_INVALID);
        }catch (TokenExpiredException e){
            throw new CustomException(ErrorCode.TOKEN_EXPIRED); //expired 만료, verify : 검증
        }


    }
    public static DecodedJWT decodedJWT(String token) {
            return JWT.decode(token);
    }

    public static String extractToken(String header) {
        if(StringUtils.hasText(header) && header.startsWith("Bearer ")){
            return header.substring(7);
        } //String 유틸스에 has 텍스트를 통해 가지고 오는 값이 텍스트가 가지고 있는 확인
        //그리고 이 값이 Bearer이라는 값으로 통과를 하는지 확인
        //Bearer 뜨워쓰기까지 해서 7 문자열 뺴고 토큰 값만 리턴
        else{
            throw new IllegalArgumentException("Invalid Auth Header");
        }
    }
    public static String getUserFromtoken(String token) { //JWT에서 subject(주로 username 또는 userId)를 추출
        DecodedJWT jwt = decodedJWT(token);
        return jwt.getSubject();

    }

    //  secret-key: "SECRET"
    //  refresh-secret-key: "REFRESH_SECRET"
    //  token-time: 300
    //  refresh-token-time: 300
}
