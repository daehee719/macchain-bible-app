package com.macchain.application.usecase;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.macchain.domain.entity.AnalysisResult;
import com.macchain.domain.entity.WordAnalysis;
import com.macchain.domain.port.BibleApiService;
import com.macchain.infrastructure.service.OpenAIService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 원어 분석 유스케이스
 */
@Component
public class AnalyzeOriginalLanguageUseCase {
    
    private final BibleApiService bibleApiService;
    private final OpenAIService openAIService;
    
    public AnalyzeOriginalLanguageUseCase(BibleApiService bibleApiService, OpenAIService openAIService) {
        this.bibleApiService = bibleApiService;
        this.openAIService = openAIService;
    }
    
    /**
     * 성경 구절의 원어 분석 수행 (프론트엔드에서 받은 텍스트 사용)
     */
    public AnalysisResult execute(String book, int chapter, int verse, String hebrewText, String englishText) {
        try {
            // 프론트엔드에서 받은 히브리어/영어 텍스트 사용
            String actualHebrewText = hebrewText != null && !hebrewText.trim().isEmpty() ? hebrewText : "히브리어 텍스트 없음";
            String actualEnglishText = englishText != null && !englishText.trim().isEmpty() ? englishText : "영어 텍스트 없음";
            
            // OpenAI API를 사용한 실제 AI 분석
            String aiAnalysis = openAIService.analyzeBibleVerse(book, chapter, verse, actualHebrewText, actualEnglishText).block();
            
            // AI 응답을 파싱하여 AnalysisResult 객체로 변환
            AnalysisResult result = parseAIAnalysis(book, chapter, verse, actualHebrewText, actualEnglishText, aiAnalysis);
            
            return result;
        } catch (Exception e) {
            // AI 분석 실패 시 기본 분석 반환
            return createFallbackAnalysis(book, chapter, verse, hebrewText, englishText);
        }
    }

    /**
     * 기존 메서드 (하위 호환성 유지)
     */
    public AnalysisResult execute(String book, int chapter, int verse) {
        try {
            // 히브리어/그리스어 원문 가져오기
            String hebrewText = bibleApiService.getHebrewText(book, chapter, verse);
            String greekText = bibleApiService.getGreekText(book, chapter, verse);
            
            // OpenAI API를 사용한 실제 AI 분석
            String aiAnalysis = openAIService.analyzeBibleVerse(book, chapter, verse, hebrewText, greekText).block();
            
            // AI 응답을 파싱하여 AnalysisResult 객체로 변환
            AnalysisResult result = parseAIAnalysis(book, chapter, verse, hebrewText, greekText, aiAnalysis);
            
            return result;
        } catch (Exception e) {
            // AI 분석 실패 시 기본 분석 반환
            String hebrewText = bibleApiService.getHebrewText(book, chapter, verse);
            String greekText = bibleApiService.getGreekText(book, chapter, verse);
            return createFallbackAnalysis(book, chapter, verse, hebrewText, greekText);
        }
    }
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * AI 분석 결과 JSON 파싱
     */
    private AnalysisResult parseAIAnalysis(String book, int chapter, int verse, String hebrewText, String greekText, String aiAnalysis) {
        try {
            // JSON 파싱
            JsonNode jsonNode = objectMapper.readTree(aiAnalysis);
            
            // 히브리어 텍스트
            String parsedHebrewText = jsonNode.has("hebrewText") ? jsonNode.get("hebrewText").asText() : hebrewText;
            
            // 단어별 분석
            List<WordAnalysis> wordAnalysis = new ArrayList<>();
            if (jsonNode.has("wordAnalysis") && jsonNode.get("wordAnalysis").isArray()) {
                for (JsonNode wordNode : jsonNode.get("wordAnalysis")) {
                    WordAnalysis word = new WordAnalysis(
                        wordNode.has("word") ? wordNode.get("word").asText() : "",
                        wordNode.has("transliteration") ? wordNode.get("transliteration").asText() : "",
                        wordNode.has("meaning") ? wordNode.get("meaning").asText() : "",
                        wordNode.has("grammar") ? wordNode.get("grammar").asText() : "",
                        wordNode.has("significance") ? wordNode.get("significance").asText() : ""
                    );
                    wordAnalysis.add(word);
                }
            }
            
            // 전체 의미
            String overallMeaning = jsonNode.has("overallMeaning") ? jsonNode.get("overallMeaning").asText() : "전체 의미를 분석할 수 없습니다.";
            
            // 문화적 배경
            String culturalBackground = jsonNode.has("culturalBackground") ? jsonNode.get("culturalBackground").asText() : "문화적 배경을 분석할 수 없습니다.";
            
                   // 실천적 적용
                   String practicalApplication = jsonNode.has("practicalApplication") ? jsonNode.get("practicalApplication").asText() : "실천적 적용을 제안할 수 없습니다.";
                   
                   // 키워드
                   List<String> keyWords = new ArrayList<>();
                   if (jsonNode.has("keyWords") && jsonNode.get("keyWords").isArray()) {
                       for (JsonNode keywordNode : jsonNode.get("keyWords")) {
                           keyWords.add(keywordNode.asText());
                       }
                   }
                   
                   return new AnalysisResult(book, chapter, verse, parsedHebrewText, wordAnalysis, overallMeaning, culturalBackground, practicalApplication, keyWords);
            
        } catch (Exception e) {
            // JSON 파싱 실패 시 폴백 분석
            return createFallbackAnalysis(book, chapter, verse, hebrewText, greekText);
        }
    }
    
    /**
     * AI 분석 실패 시 기본 분석 반환
     */
    private AnalysisResult createFallbackAnalysis(String book, int chapter, int verse, String hebrewText, String greekText) {
           List<WordAnalysis> wordAnalysis = new ArrayList<>();
           wordAnalysis.add(new WordAnalysis("בְּרֵאשִׁית", "bereshit", "처음에, 시작에", "시간 부사", "창조의 시작을 나타내는 중요한 단어"));
           wordAnalysis.add(new WordAnalysis("בָּרָא", "bara", "창조하다", "동사, Qal 완료형", "하나님만이 할 수 있는 창조 행위"));
           wordAnalysis.add(new WordAnalysis("אֱלֹהִים", "elohim", "하나님", "명사, 복수형", "창조주 하나님의 이름"));
           
           List<String> keyWords = new ArrayList<>();
           keyWords.add("창조");
           keyWords.add("시작");
           keyWords.add("하나님");
           keyWords.add("하늘");
           keyWords.add("땅");
           
           // 실제 히브리어 텍스트 사용
           String actualHebrewText = hebrewText != null && !hebrewText.trim().isEmpty() ? hebrewText : "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ";
           
           return new AnalysisResult(
               book, chapter, verse, actualHebrewText, wordAnalysis,
               "이 구절은 하나님의 창조 사역의 시작을 보여주는 중요한 구절입니다.",
               "고대 근동 문화에서 창조 이야기는 신들의 권위와 우주의 질서를 설명하는 중요한 역할을 했습니다.",
               "현대 신자들에게 이 구절은 하나님의 주권과 창조의 목적을 상기시킵니다.",
               keyWords
           );
    }
}
