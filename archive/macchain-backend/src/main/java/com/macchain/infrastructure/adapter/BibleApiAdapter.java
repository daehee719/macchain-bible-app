package com.macchain.infrastructure.adapter;

import com.macchain.domain.port.BibleApiPort;
import com.macchain.domain.valueobject.Reading;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 성경 API 어댑터 (외부 API 연동 구현)
 */
@Component
public class BibleApiAdapter implements BibleApiPort {
    
    private final WebClient webClient;
    private final String BASE_URL = "https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles";
    
    public BibleApiAdapter() {
        this.webClient = WebClient.builder()
                .baseUrl(BASE_URL)
                .build();
    }
    
    @Override
    public BibleContent getBibleContent(Reading reading, String version) {
        try {
            String url = String.format("/%s/books/%s/chapters/%d.json", 
                    version, reading.getBook(), reading.getChapter());
            
            BibleApiResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(BibleApiResponse.class)
                    .block();
            
            if (response == null || response.data == null) {
                throw new RuntimeException("Failed to fetch Bible content");
            }
            
            List<BibleVerse> verses = response.data.stream()
                    .map(item -> new BibleVerse(
                            Integer.parseInt(item.verse),
                            item.text
                    ))
                    .collect(Collectors.toList());
            
            return new BibleContent(
                    reading.getBook(),
                    reading.getChapter(),
                    version,
                    verses,
                    response.summary != null ? response.summary : ""
            );
            
        } catch (Exception e) {
            throw new RuntimeException("Error fetching Bible content: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<BibleContent> getBibleContents(List<Reading> readings, String version) {
        return readings.stream()
                .map(reading -> getBibleContent(reading, version))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<String> getAvailableVersions() {
        return List.of("en-kjv", "he-wlc");
    }
    
    /**
     * 외부 API 응답 DTO
     */
    private static class BibleApiResponse {
        public List<BibleApiVerse> data;
        public String summary;
    }
    
    private static class BibleApiVerse {
        public String verse;
        public String text;
    }
}

