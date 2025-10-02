package com.macchain.infrastructure.service;

import com.macchain.domain.port.BibleApiService;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * 성경 API 서비스 구현체
 */
@Service
public class BibleApiServiceImpl implements BibleApiService {
    
    private final WebClient webClient;
    private final String BIBLE_API_BASE_URL = "https://bible-api.com";
    
    public BibleApiServiceImpl() {
        this.webClient = WebClient.builder()
                .baseUrl(BIBLE_API_BASE_URL)
                .build();
    }
    
    @Override
    public String getHebrewText(String book, int chapter, int verse) {
        // 프론트엔드에서 받은 히브리어 텍스트를 그대로 반환
        // 실제로는 프론트엔드에서 API 호출로 가져온 텍스트를 사용
        return "히브리어 텍스트는 프론트엔드에서 제공됩니다";
    }
    
    @Override
    public String getGreekText(String book, int chapter, int verse) {
        try {
            // 실제 그리스어 성경 API 호출
            String reference = String.format("%s+%d:%d", book, chapter, verse);
            
            return webClient.get()
                    .uri("/{reference}", reference)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            // API 호출 실패 시 기본값 반환
            return "Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν";
        }
    }
    
    @Override
    public String getEnglishText(String book, int chapter, int verse) {
        try {
            String reference = String.format("%s+%d:%d", book, chapter, verse);
            
            return webClient.get()
                    .uri("/{reference}", reference)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("영어 번역을 가져오는데 실패했습니다: " + e.getMessage(), e);
        }
    }
}
