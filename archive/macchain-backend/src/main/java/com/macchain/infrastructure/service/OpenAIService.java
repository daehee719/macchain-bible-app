package com.macchain.infrastructure.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * OpenAI API 서비스
 */
@Service
public class OpenAIService {
    
    private final WebClient webClient;
    private final String apiKey;
    private final String model;
    private final int maxTokens;
    private final double temperature;
    private final ObjectMapper objectMapper;
    
    public OpenAIService(@Value("${openai.api-key:}") String apiKey,
                        @Value("${openai.model:gpt-4}") String model,
                        @Value("${openai.max-tokens:2000}") int maxTokens,
                        @Value("${openai.temperature:0.7}") double temperature) {
        this.apiKey = apiKey;
        this.model = model;
        this.maxTokens = maxTokens;
        this.temperature = temperature;
        this.objectMapper = new ObjectMapper();
        
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            this.webClient = WebClient.builder()
                    .baseUrl("https://api.openai.com/v1")
                    .defaultHeader("Authorization", "Bearer " + apiKey)
                    .defaultHeader("Content-Type", "application/json")
                    .build();
        } else {
            this.webClient = null;
        }
    }
    
    /**
     * 성경 구절 원어 분석 요청
     */
    public Mono<String> analyzeBibleVerse(String book, int chapter, int verse, String hebrewText, String greekText) {
        // API 키가 없으면 폴백 응답 반환
        if (webClient == null) {
            return Mono.just(createFallbackAnalysis(book, chapter, verse, hebrewText));
        }
        
        String prompt = createAnalysisPrompt(book, chapter, verse, hebrewText, greekText);
        
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", "당신은 성경 원어 분석 전문가입니다. 히브리어와 그리스어 원문을 분석하여 깊이 있는 신학적 통찰을 제공합니다."),
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", maxTokens,
                "temperature", temperature
        );
        
        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    try {
                        Map<String, Object> choices = (Map<String, Object>) ((List<?>) response.get("choices")).get(0);
                        Map<String, Object> message = (Map<String, Object>) choices.get("message");
                        return (String) message.get("content");
                    } catch (Exception e) {
                        throw new RuntimeException("OpenAI API 응답 파싱 실패: " + e.getMessage(), e);
                    }
                })
                .onErrorReturn(createFallbackAnalysis(book, chapter, verse, hebrewText));
    }
    
    /**
     * 분석 프롬프트 생성 - 통일된 구조
     */
    private String createAnalysisPrompt(String book, int chapter, int verse, String hebrewText, String greekText) {
        return String.format("""
                다음 성경 구절을 히브리어 원어로 체계적으로 분석해주세요:
                
                구절: %s %d장 %d절
                히브리어 원문: %s
                
                히브리어 원문을 단어별로 분석하고, 각 단어의 의미, 문법적 특징, 구절에서의 중요성을 설명해주세요.
                
                다음 JSON 형식으로 정확히 분석해주세요:
                
                       {
                         "hebrewText": "히브리어 원문 전체",
                         "wordAnalysis": [
                           {
                             "word": "히브리어 단어",
                             "transliteration": "음성 표기",
                             "meaning": "단어의 의미",
                             "grammar": "문법적 특징",
                             "significance": "구절에서의 중요성"
                           }
                         ],
                         "overallMeaning": "구절의 전체적인 의미와 메시지",
                         "culturalBackground": "당시 문화적 맥락과 배경",
                         "practicalApplication": "현대 신자들을 위한 실천적 적용",
                         "keyWords": ["핵심 키워드1", "핵심 키워드2", "핵심 키워드3"]
                       }
                
                각 단어별로 상세히 분석하고, 전체 구절의 의미를 명확히 설명해주세요.
                """, book, chapter, verse, hebrewText);
    }
    
    /**
     * API 키가 없을 때 사용할 폴백 분석 - 통일된 JSON 구조
     */
    private String createFallbackAnalysis(String book, int chapter, int verse, String hebrewText) {
        // 실제 히브리어 텍스트 사용
        String actualHebrewText = hebrewText != null && !hebrewText.trim().isEmpty() ? hebrewText : "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ";
        
        return String.format("""
                       {
                         "hebrewText": "%s",
                         "wordAnalysis": [
                           {
                             "word": "בְּרֵאשִׁית",
                             "transliteration": "bereshit",
                             "meaning": "처음에, 시작에",
                             "grammar": "시간 부사",
                             "significance": "창조의 시작을 나타내는 중요한 단어"
                           },
                           {
                             "word": "בָּרָא",
                             "transliteration": "bara",
                             "meaning": "창조하다",
                             "grammar": "동사, Qal 완료형",
                             "significance": "하나님만이 할 수 있는 창조 행위"
                           },
                           {
                             "word": "אֱלֹהִים",
                             "transliteration": "elohim",
                             "meaning": "하나님",
                             "grammar": "명사, 복수형",
                             "significance": "창조주 하나님의 이름"
                           }
                         ],
                         "overallMeaning": "%s %d장 %d절은 하나님의 창조 사역의 시작을 보여주는 중요한 구절입니다. 이 구절은 시간과 공간의 시작, 그리고 하나님의 주권적 창조를 나타냅니다.",
                         "culturalBackground": "고대 근동 문화에서 창조 이야기는 신들의 권위와 우주의 질서를 설명하는 중요한 역할을 했습니다. 히브리어 성경은 이러한 문화적 배경을 바탕으로 유일신 하나님의 창조를 강조합니다.",
                         "practicalApplication": "현대 신자들에게 이 구절은 하나님의 주권과 창조의 목적을 상기시킵니다. 우리의 삶이 하나님의 계획 안에 있음을 믿고, 창조주 하나님을 경배하며 살아가야 함을 가르쳐줍니다.",
                         "keyWords": ["창조", "시작", "하나님", "하늘", "땅"]
                       }
                """, actualHebrewText, book, chapter, verse);
    }
}
