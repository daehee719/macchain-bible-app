package com.macchain.presentation.controller;

import com.macchain.domain.entity.WordAnalysis;
import com.macchain.presentation.dto.AnalysisRequest;
import com.macchain.presentation.dto.AnalysisResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

/**
 * 개발 환경용 Mock AI 원어 분석 REST 컨트롤러
 */
@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = {"http://localhost:3000"})
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "dev", matchIfMissing = true)
public class MockAIAnalysisController {
    
    /**
     * Mock 성경 구절 원어 분석
     */
    @PostMapping("/verse/{book}/{chapter}/{verse}")
    public ResponseEntity<AnalysisResponse> analyzeVerse(
            @PathVariable String book,
            @PathVariable int chapter,
            @PathVariable int verse,
            @RequestBody AnalysisRequest request) {
        
        try {
            // Mock 히브리어 텍스트 (실제로는 request에서 받아온 것을 사용)
            String hebrewText = request.getHebrewText() != null && !request.getHebrewText().isEmpty() 
                ? request.getHebrewText() 
                : generateMockHebrewText(book, chapter, verse);
            
            // Mock 단어별 분석
            List<WordAnalysis> wordAnalysisList = generateMockWordAnalysisList(book, chapter, verse);
            
            // Mock 전체 의미
            String overallMeaning = generateMockOverallMeaning(book, chapter, verse);
            
            // Mock 문화적 배경
            String culturalBackground = generateMockCulturalBackground(book, chapter, verse);
            
            // Mock 실용적 적용
            String practicalApplication = generateMockPracticalApplication(book, chapter, verse);
            
            // Mock 키워드
            List<String> keyWords = generateMockKeyWords(book, chapter, verse);
            
            AnalysisResponse response = new AnalysisResponse(
                true,
                "Mock 원어분석이 완료되었습니다.",
                book,
                chapter,
                verse,
                hebrewText,
                wordAnalysisList,
                overallMeaning,
                culturalBackground,
                practicalApplication,
                keyWords
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(AnalysisResponse.error("Mock 원어 분석 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * Mock 성경 장 전체 분석
     */
    @GetMapping("/chapter/{book}/{chapter}")
    public ResponseEntity<AnalysisResponse> analyzeChapter(
            @PathVariable String book,
            @PathVariable int chapter) {
        
        try {
            // 첫 번째 구절을 대표로 Mock 분석
            AnalysisRequest mockRequest = new AnalysisRequest();
            mockRequest.setBook(book);
            mockRequest.setChapter(chapter);
            mockRequest.setVerse(1);
            
            return analyzeVerse(book, chapter, 1, mockRequest);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(AnalysisResponse.error("Mock 장 분석 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    private String generateMockHebrewText(String book, int chapter, int verse) {
        // 간단한 Mock 히브리어 텍스트
        return "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ";
    }
    
    private List<WordAnalysis> generateMockWordAnalysisList(String book, int chapter, int verse) {
        return Arrays.asList(
            new WordAnalysis(
                "בְּרֵאשִׁית",
                "베레시트",
                "처음에, 시작에",
                "전치사구, 시간 부사",
                "하나님의 창조 사역의 절대적 시작점을 나타냄"
            ),
            new WordAnalysis(
                "בָּרָא",
                "바라",
                "창조하다",
                "칼 완료형 3인칭 남성 단수",
                "무에서 유를 창조하는 하나님의 독특한 능력"
            ),
            new WordAnalysis(
                "אֱלֹהִים",
                "엘로힘",
                "하나님",
                "남성 복수형이지만 단수 의미",
                "하나님의 위엄과 능력을 강조"
            )
        );
    }
    
    private String generateMockOverallMeaning(String book, int chapter, int verse) {
        return String.format("""
            **%s %d:%d 전체 의미 (Mock)**
            
            이 구절은 성경 전체의 서두를 장식하는 중요한 선언문입니다. 
            하나님께서 시간과 공간의 시작점에서 천지를 창조하셨음을 선포합니다.
            
            히브리어 원문의 구조는 하나님의 창조 행위가 계획적이고 의도적이었음을 보여줍니다.
            '바라'(창조하다) 동사는 성경에서 오직 하나님만이 주체가 되는 특별한 창조 행위를 나타냅니다.
            """, book, chapter, verse);
    }
    
    private String generateMockCulturalBackground(String book, int chapter, int verse) {
        return String.format("""
            **%s %d:%d 문화적 배경 (Mock)**
            
            고대 근동 지역의 창조 신화들과 달리, 성경의 창조 기록은 다음과 같은 독특함을 보입니다:
            
            1. **단일신론적 관점**: 여러 신들의 갈등이 아닌 한 분 하나님의 주권적 창조
            2. **질서 있는 창조**: 혼돈에서 질서로의 체계적 변화
            3. **선한 창조**: 창조된 모든 것이 '좋았더라'는 평가
            
            이는 당시 메소포타미아의 에누마 엘리시나 이집트 창조 신화와 뚜렷한 대조를 이룹니다.
            """, book, chapter, verse);
    }
    
    private String generateMockPracticalApplication(String book, int chapter, int verse) {
        return String.format("""
            **%s %d:%d 실용적 적용 (Mock)**
            
            **개인적 적용:**
            - 하나님이 나의 삶의 창조주이심을 인정하고 의존하기
            - 매일을 새로운 창조의 기회로 바라보기
            - 하나님의 질서 안에서 살아가기
            
            **공동체적 적용:**
            - 창조 질서를 존중하는 환경 보호 실천
            - 모든 사람이 하나님의 형상으로 창조되었음을 인정
            - 창조주 하나님께 함께 예배드리기
            
            **사회적 적용:**
            - 창조 세계의 청지기 역할 감당
            - 과학과 신앙의 조화로운 관계 추구
            """, book, chapter, verse);
    }
    
    private List<String> generateMockKeyWords(String book, int chapter, int verse) {
        return Arrays.asList(
            "창조", "시작", "하나님", "천지", "주권", "질서", "선함", "목적"
        );
    }
}
