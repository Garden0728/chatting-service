package com.example.Chatspringboot.config;


import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.TransactionTemplate;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
public class MYSQLConfig {
    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;



    @Bean(name = "transactionManager")

    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }

    @Bean(name="createUserTransactionManager")
    @Primary//PlatformTransactionManager spring 트랜잭션 상위 인터페이스 JpaTransactionManager : JPA 전용 구현체
    public PlatformTransactionManager createUserTransactionManager(EntityManagerFactory emf) {
         return new JpaTransactionManager(emf);
    }
    @Bean(name = "createChatTransactionManager")
    public PlatformTransactionManager createChatTransactionManager(EntityManagerFactory emf) {
         return new JpaTransactionManager(emf);
    }
    @Bean
    public TransactionTemplate transactionTemplate( @Qualifier("createUserTransactionManager") PlatformTransactionManager txManager) {
        return new TransactionTemplate(txManager);
    }

}
