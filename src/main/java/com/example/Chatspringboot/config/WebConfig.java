package com.example.Chatspringboot.config;


import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//webmvcController를 구현하여 웹 관련 설정을 지정.
@Configuration
//webMvcConfigurer spring mvc의 설정을 커스터마이징하기 위한 인터페이스
public class WebConfig implements WebMvcConfigurer {
    @Override
    //CORS 정책을 설정
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") //모든 경로 허용
                .allowedOriginPatterns("http://localhost:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true) //자격증명 허용
                .maxAge(3600); //preflight 요청 유효 시간 //





    }
}
