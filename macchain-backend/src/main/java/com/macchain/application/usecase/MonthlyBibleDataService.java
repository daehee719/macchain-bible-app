package com.macchain.application.usecase;

import com.macchain.domain.entity.MonthlyBibleData;
import com.macchain.infrastructure.repository.MonthlyBibleDataRepository;
import com.macchain.infrastructure.adapter.BibleApiAdapter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 월별 성경 데이터 서비스
 */
@Service
public class MonthlyBibleDataService {
    
    private final MonthlyBibleDataRepository monthlyBibleDataRepository;
    private final BibleApiAdapter bibleApiAdapter;
    
    public MonthlyBibleDataService(
            MonthlyBibleDataRepository monthlyBibleDataRepository,
            BibleApiAdapter bibleApiAdapter) {
        this.monthlyBibleDataRepository = monthlyBibleDataRepository;
        this.bibleApiAdapter = bibleApiAdapter;
    }
    
    /**
     * 특정 월의 모든 성경 데이터를 미리 저장
     */
    @Transactional
    public void preloadMonthlyData(int year, int month) {
        // 이미 데이터가 있으면 스킵
        if (monthlyBibleDataRepository.existsByYearAndMonth(year, month)) {
            System.out.println("📅 " + year + "년 " + month + "월 데이터가 이미 존재합니다.");
            return;
        }
        
        System.out.println("📅 " + year + "년 " + month + "월 데이터 로딩 시작...");
        
        // 해당 월의 모든 일자에 대한 읽기 플랜 조회
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        List<MonthlyBibleData> monthlyData = new ArrayList<>();
        
        // 간단한 테스트 데이터로 시작
        MonthlyBibleData testData = new MonthlyBibleData();
        testData.setYear(year);
        testData.setMonth(month);
        testData.setBook("Genesis");
        testData.setChapter(1);
        testData.setVerse(1);
        testData.setEnglishText("In the beginning God created the heavens and the earth.");
        testData.setHebrewText("בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ");
        
        monthlyData.add(testData);
        
        // 배치 저장
        monthlyBibleDataRepository.saveAll(monthlyData);
        System.out.println("✅ " + year + "년 " + month + "월 데이터 로딩 완료: " + monthlyData.size() + "개 구절");
    }
    
    
    /**
     * 특정 구절 데이터 조회
     */
    public MonthlyBibleData getVerseData(int year, int month, String book, int chapter, int verse) {
        return monthlyBibleDataRepository.findByYearAndMonthAndBookAndChapterAndVerse(
            year, month, book, chapter, verse
        ).orElse(null);
    }
    
    /**
     * 특정 장의 모든 구절 데이터 조회
     */
    public List<MonthlyBibleData> getChapterData(int year, int month, String book, int chapter) {
        return monthlyBibleDataRepository.findByYearAndMonthAndBookAndChapter(
            year, month, book, chapter
        );
    }
}
