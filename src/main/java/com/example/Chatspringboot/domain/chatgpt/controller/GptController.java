package com.example.Chatspringboot.domain.chatgpt.controller;
import com.example.Chatspringboot.domain.chatgpt.Service.GptService;
import com.example.Chatspringboot.domain.chatgpt.model.request.GptRequestDto;
import com.example.Chatspringboot.domain.chatgpt.model.response.GptResponseDto;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Gpt api", description = "gpt API V1")
@RestController
@RequestMapping("/api/v1/gpt")
@RequiredArgsConstructor
public class GptController {
    private final GptService gptService;

    @PostMapping("/word-dictionary")
    public ResponseEntity<GptResponseDto> wordDictionary(@RequestBody GptRequestDto gptRequestDto) {
        GptResponseDto response = gptService.instruct(gptRequestDto);
        return ResponseEntity.ok(response);
    }

}
