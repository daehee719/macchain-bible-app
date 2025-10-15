package com.macchain.presentation.controller;

import com.macchain.application.usecase.MonthlyBibleDataService;
import com.macchain.domain.entity.MonthlyBibleData;
import com.macchain.infrastructure.scheduler.MonthlyDataScheduler;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 월별 성경 데이터 컨트롤러
 */
@RestController
@RequestMapping("/api/monthly-bible")
@CrossOrigin(origins = "http://localhost:3000")
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "prod", matchIfMissing = false)
public class MonthlyBibleDataController {
    
    private final MonthlyBibleDataService monthlyBibleDataService;
    private final MonthlyDataScheduler monthlyDataScheduler;
    
    public MonthlyBibleDataController(
            MonthlyBibleDataService monthlyBibleDataService,
            MonthlyDataScheduler monthlyDataScheduler) {
        this.monthlyBibleDataService = monthlyBibleDataService;
        this.monthlyDataScheduler = monthlyDataScheduler;
    }
    
    /**
     * 특정 구절 데이터 조회
     */
    @GetMapping("/verse/{year}/{month}/{book}/{chapter}/{verse}")
    public ResponseEntity<MonthlyBibleData> getVerseData(
            @PathVariable int year,
            @PathVariable int month,
            @PathVariable String book,
            @PathVariable int chapter,
            @PathVariable int verse) {
        
        MonthlyBibleData data = monthlyBibleDataService.getVerseData(year, month, book, chapter, verse);
        
        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 특정 장의 모든 구절 데이터 조회
     */
    @GetMapping("/chapter/{year}/{month}/{book}/{chapter}")
    public ResponseEntity<List<MonthlyBibleData>> getChapterData(
            @PathVariable int year,
            @PathVariable int month,
            @PathVariable String book,
            @PathVariable int chapter) {
        
        List<MonthlyBibleData> data = monthlyBibleDataService.getChapterData(year, month, book, chapter);
        
        if (!data.isEmpty()) {
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 특정 월 데이터 존재 여부 확인
     */
    @GetMapping("/exists/{year}/{month}")
    public ResponseEntity<Boolean> hasMonthData(
            @PathVariable int year,
            @PathVariable int month) {
        
        boolean exists = monthlyBibleDataService.getChapterData(year, month, "genesis", 1).size() > 0;
        return ResponseEntity.ok(exists);
    }
    
    /**
     * 수동으로 특정 월 데이터 로딩 (관리자용)
     */
    @PostMapping("/preload/{year}/{month}")
    public ResponseEntity<String> preloadMonthData(
            @PathVariable int year,
            @PathVariable int month) {
        
        try {
            monthlyDataScheduler.preloadSpecificMonth(year, month);
            return ResponseEntity.ok("데이터 로딩이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("데이터 로딩 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 현재 월 데이터 로딩
     */
    @PostMapping("/preload/current")
    public ResponseEntity<String> preloadCurrentMonthData() {
        LocalDate now = LocalDate.now();
        int year = now.getYear();
        int month = now.getMonthValue();
        
        try {
            monthlyDataScheduler.preloadSpecificMonth(year, month);
            return ResponseEntity.ok("현재 월(" + year + "년 " + month + "월) 데이터 로딩이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("데이터 로딩 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}

