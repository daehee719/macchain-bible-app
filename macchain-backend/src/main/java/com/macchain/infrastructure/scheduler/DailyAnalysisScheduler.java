package com.macchain.infrastructure.scheduler;

import com.macchain.application.usecase.AnalyzeOriginalLanguageUseCase;
import com.macchain.domain.entity.ReadingPlan;
import com.macchain.domain.port.ReadingPlanRepository;
import com.macchain.infrastructure.repository.VerseAnalysisMongoRepository;
import com.macchain.domain.entity.VerseAnalysisDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 일일 원어분석 배치 작업
 * 매일 새벽 2시에 실행되어 오늘의 읽기 계획에 대한 모든 구절을 AI로 분석하고 DB에 저장
 */
@Component
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "prod", matchIfMissing = false)
public class DailyAnalysisScheduler {
    
    private static final Logger logger = LoggerFactory.getLogger(DailyAnalysisScheduler.class);
    
    private final ReadingPlanRepository readingPlanRepository;
    private final AnalyzeOriginalLanguageUseCase analyzeOriginalLanguageUseCase;
    private final VerseAnalysisMongoRepository verseAnalysisMongoRepository;
    
    public DailyAnalysisScheduler(ReadingPlanRepository readingPlanRepository,
                                 AnalyzeOriginalLanguageUseCase analyzeOriginalLanguageUseCase,
                                 VerseAnalysisMongoRepository verseAnalysisMongoRepository) {
        this.readingPlanRepository = readingPlanRepository;
        this.analyzeOriginalLanguageUseCase = analyzeOriginalLanguageUseCase;
        this.verseAnalysisMongoRepository = verseAnalysisMongoRepository;
    }
    
    /**
     * 매일 새벽 2시에 실행되는 배치 작업
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void generateDailyAnalysis() {
        logger.info("🌅 일일 원어분석 배치 작업 시작");
        
        try {
            // 오늘의 읽기 계획 가져오기
            LocalDate today = LocalDate.now();
            int dayOfYear = today.getDayOfYear();
            int dayNumber = dayOfYear > 50 ? ((dayOfYear - 1) % 50) + 1 : dayOfYear;
            
            Optional<ReadingPlan> planOpt = readingPlanRepository.findByDayNumber(dayNumber);
            if (planOpt.isEmpty()) {
                logger.warn("⚠️ Day {}에 대한 읽기 계획을 찾을 수 없습니다.", dayNumber);
                return;
            }
            
            ReadingPlan plan = planOpt.get();
            logger.info("📚 Day {} 읽기 계획 분석 시작: {}개 읽기 항목", 
                dayNumber, plan.getReadings().size());
            
            // 각 읽기 항목에 대해 분석 수행
            int totalAnalyzed = analyzeReadingPlan(plan);
            
            logger.info("✅ 일일 원어분석 배치 작업 완료 - 총 {}개 구절 분석됨", totalAnalyzed);
            
        } catch (Exception e) {
            logger.error("❌ 일일 원어분석 배치 작업 실패", e);
        }
    }
    
    /**
     * 수동으로 오늘의 분석 실행 (테스트용)
     */
    public void runTodayAnalysis() {
        logger.info("🔧 수동 일일 원어분석 실행");
        generateDailyAnalysis();
    }
    
    private int analyzeReadingPlan(ReadingPlan plan) {
        int totalAnalyzed = 0;
        // 읽기 계획의 각 항목 분석
        for (var reading : plan.getReadings()) {
            totalAnalyzed += analyzeReading(reading.getBook(), reading.getChapter());
        }
        return totalAnalyzed;
    }
    
    private int analyzeReading(String book, int chapter) {
        int analyzedCount = 0;
        try {
            logger.info("🔍 {} {}장 분석 시작", book, chapter);
            
            // 1-50절까지 분석 (대부분의 장이 50절 이하)
            for (int verse = 1; verse <= 50; verse++) {
                try {
                    // 이미 분석된 구절인지 확인
                    if (verseAnalysisMongoRepository.existsByBookAndChapterAndVerse(book, chapter, verse)) {
                        logger.debug("⏭️ {} {}:{} 이미 분석됨, 건너뛰기", book, chapter, verse);
                        continue;
                    }
                    
                    // AI 분석 수행
                    var analysis = analyzeOriginalLanguageUseCase.execute(book, chapter, verse);
                    if (analysis != null) {
                        // MongoDB에 저장
                        VerseAnalysisDocument document = new VerseAnalysisDocument();
                        document.setBook(book);
                        document.setChapter(chapter);
                        document.setVerse(verse);
                        document.setHebrewText(analysis.getHebrewText());
                        document.setWordAnalysis(analysis.getWordAnalysis());
                        document.setAiExplanation(analysis.getOverallMeaning());
                        document.setGrammaticalAnalysis(analysis.getCulturalBackground());
                        document.setCulturalContext(analysis.getPracticalApplication());
                        document.setKeyWords(analysis.getKeyWords());
                        document.setAnalysisDate(LocalDate.now());
                        
                        verseAnalysisMongoRepository.save(document);
                        analyzedCount++;
                        logger.debug("✅ {} {}:{} 분석 완료", book, chapter, verse);
                    } else {
                        logger.warn("⚠️ {} {}:{} 분석 실패", book, chapter, verse);
                    }
                    
                    // API 호출 제한을 위한 짧은 대기
                    Thread.sleep(100);
                    
                } catch (Exception e) {
                    logger.error("❌ {} {}:{} 분석 중 오류", book, chapter, verse, e);
                }
            }
            
            logger.info("✅ {} {}장 분석 완료 - {}개 구절 분석됨", book, chapter, analyzedCount);
            return analyzedCount;
            
        } catch (Exception e) {
            logger.error("❌ {} {}장 분석 실패", book, chapter, e);
            return analyzedCount;
        }
    }
}
