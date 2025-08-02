package com.example.Chatspringboot.domain.user.model.Dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User 검색 단일 유저  Dto")
public record UserSearchDto (
        @Schema(description = "아이디")
        Long id,

        @Schema(description = "이름")
        String name
){}
