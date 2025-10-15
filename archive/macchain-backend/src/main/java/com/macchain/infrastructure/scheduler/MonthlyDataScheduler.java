package com.macchain.infrastructure.scheduler;

import com.macchain.application.usecase.MonthlyBibleDataService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * 월별 성경 데이터 스케줄러
 */
@Component
public class MonthlyDataScheduler {
    
    private final MonthlyBibleDataService monthlyBibleDataService;
    
    public MonthlyDataScheduler(MonthlyBibleDataService monthlyBibleDataService) {
        this.monthlyBibleDataService = monthlyBibleDataService;
    }
    
    /**
     * 매월 1일 새벽 2시에 다음 달 데이터 미리 로딩
     */
    @Scheduled(cron = "0 0 2 1 * ?")
    public void preloadNextMonthData() {
        LocalDate nextMonth = LocalDate.now().plusMonths(1);
        int year = nextMonth.getYear();
        int month = nextMonth.getMonthValue();
        
        System.out.println("📅 다음 달 데이터 미리 로딩 시작: " + year + "년 " + month + "월");
        
        try {
            monthlyBibleDataService.preloadMonthlyData(year, month);
            System.out.println("✅ 다음 달 데이터 미리 로딩 완료");
        } catch (Exception e) {
            System.err.println("❌ 다음 달 데이터 미리 로딩 실패: " + e.getMessage());
        }
    }
    
    /**
     * 수동으로 특정 월 데이터 로딩 (관리자용)
     */
    public void preloadSpecificMonth(int year, int month) {
        System.out.println("📅 수동 데이터 로딩 시작: " + year + "년 " + month + "월");
        
        try {
            monthlyBibleDataService.preloadMonthlyData(year, month);
            System.out.println("✅ 수동 데이터 로딩 완료");
        } catch (Exception e) {
            System.err.println("❌ 수동 데이터 로딩 실패: " + e.getMessage());
        }
    }
}

