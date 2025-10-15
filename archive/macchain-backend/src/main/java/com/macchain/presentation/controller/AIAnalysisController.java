package com.macchain.presentation.controller;

import com.macchain.application.usecase.AnalyzeOriginalLanguageUseCase;
import com.macchain.domain.entity.AnalysisResult;
import com.macchain.domain.entity.VerseAnalysisDocument;
import com.macchain.infrastructure.repository.VerseAnalysisMongoRepository;
import com.macchain.infrastructure.scheduler.DailyAnalysisScheduler;
import com.macchain.presentation.dto.AnalysisRequest;
import com.macchain.presentation.dto.AnalysisResponse;
import com.macchain.presentation.mapper.AnalysisResponseMapper;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * AI 원어 분석 REST 컨트롤러
 */
@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = {"http://localhost:3000"})
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "prod", matchIfMissing = false)
public class AIAnalysisController {
    
    private final AnalyzeOriginalLanguageUseCase analyzeOriginalLanguageUseCase;
    private final AnalysisResponseMapper analysisResponseMapper;
    private final VerseAnalysisMongoRepository verseAnalysisMongoRepository;
    private final DailyAnalysisScheduler dailyAnalysisScheduler;
    
    public AIAnalysisController(AnalyzeOriginalLanguageUseCase analyzeOriginalLanguageUseCase,
                               AnalysisResponseMapper analysisResponseMapper,
                               VerseAnalysisMongoRepository verseAnalysisMongoRepository,
                               DailyAnalysisScheduler dailyAnalysisScheduler) {
        this.analyzeOriginalLanguageUseCase = analyzeOriginalLanguageUseCase;
        this.analysisResponseMapper = analysisResponseMapper;
        this.verseAnalysisMongoRepository = verseAnalysisMongoRepository;
        this.dailyAnalysisScheduler = dailyAnalysisScheduler;
    }
    
    /**
     * 성경 구절 원어 분석 (프론트엔드에서 히브리어/영어 텍스트 전달)
     */
    @PostMapping("/verse/{book}/{chapter}/{verse}")
    public ResponseEntity<AnalysisResponse> analyzeVerse(
            @PathVariable String book,
            @PathVariable int chapter,
            @PathVariable int verse,
            @RequestBody AnalysisRequest request) {
        
        try {
            // 1. MongoDB에서 먼저 조회
            Optional<VerseAnalysisDocument> existingAnalysis = verseAnalysisMongoRepository.findByBookAndChapterAndVerse(book, chapter, verse);

            if (existingAnalysis.isPresent()) {
                // MongoDB에 있는 경우 - 빠른 응답
                VerseAnalysisDocument analysis = existingAnalysis.get();
                AnalysisResponse response = new AnalysisResponse(
                    true,
                    "원어분석이 완료되었습니다.",
                    book,
                    chapter,
                    verse,
                    analysis.getHebrewText(),
                    analysis.getWordAnalysis(),
                    analysis.getAiExplanation(),
                    analysis.getGrammaticalAnalysis(),
                    analysis.getCulturalContext(),
                    analysis.getKeyWords()
                );
                return ResponseEntity.ok(response);
            } else {
                // MongoDB에 없는 경우 실시간 분석 (프론트엔드에서 받은 텍스트 사용)
                AnalysisResult result = analyzeOriginalLanguageUseCase.execute(book, chapter, verse, request.getHebrewText(), request.getEnglishText());
                AnalysisResponse response = analysisResponseMapper.toResponse(result);

                // 분석 성공 시 MongoDB에 저장
                if (response.isSuccess()) {
                    VerseAnalysisDocument document = new VerseAnalysisDocument();
                    document.setBook(book);
                    document.setChapter(chapter);
                    document.setVerse(verse);
                    document.setHebrewText(response.getHebrewText());
                    document.setWordAnalysis(response.getWordAnalysis());
                    document.setAiExplanation(response.getOverallMeaning());
                    document.setGrammaticalAnalysis(response.getCulturalBackground());
                    document.setCulturalContext(response.getPracticalApplication());
                    document.setKeyWords(response.getKeyWords());
                    document.setAnalysisDate(java.time.LocalDate.now());

                    verseAnalysisMongoRepository.save(document);
                }

                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(AnalysisResponse.error("원어 분석 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 성경 장 전체 분석
     */
    @GetMapping("/chapter/{book}/{chapter}")
    public ResponseEntity<AnalysisResponse> analyzeChapter(
            @PathVariable String book,
            @PathVariable int chapter) {
        
        try {
            // 첫 번째 구절을 대표로 분석
            AnalysisResult result = analyzeOriginalLanguageUseCase.execute(book, chapter, 1);
            AnalysisResponse response = analysisResponseMapper.toResponse(result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(AnalysisResponse.error("장 분석 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 수동으로 오늘의 모든 구절 분석 실행 (관리자용)
     */
    @PostMapping("/batch/today")
    public ResponseEntity<String> runTodayAnalysis() {
        try {
            dailyAnalysisScheduler.runTodayAnalysis();
            return ResponseEntity.ok("오늘의 구절 분석이 시작되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("배치 분석 실행 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
