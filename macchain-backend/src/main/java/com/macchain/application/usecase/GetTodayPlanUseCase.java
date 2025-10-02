package com.macchain.application.usecase;

import com.macchain.domain.entity.ReadingPlan;
import com.macchain.domain.port.ReadingPlanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

/**
 * 오늘의 읽기 계획 조회 유스케이스
 */
@Service
public class GetTodayPlanUseCase {
    
    private final ReadingPlanRepository readingPlanRepository;
    
    public GetTodayPlanUseCase(ReadingPlanRepository readingPlanRepository) {
        this.readingPlanRepository = readingPlanRepository;
    }
    
    /**
     * 오늘의 읽기 계획 조회
     * 1월 1일부터 현재까지의 일수를 계산하여 해당하는 Day의 데이터를 반환
     */
    public Optional<ReadingPlan> execute() {
        // 1월 1일부터 현재까지의 일수 계산
        LocalDate january1st = LocalDate.of(LocalDate.now().getYear(), 1, 1);
        LocalDate today = LocalDate.now();
        int dayOfYear = (int) ChronoUnit.DAYS.between(january1st, today) + 1;
        
        // 365일을 넘으면 1일로 순환 (현재는 10일까지만 있으므로 10일로 제한)
        int dayNumber = dayOfYear > 10 ? ((dayOfYear - 1) % 10) + 1 : dayOfYear;
        
        System.out.println("📅 오늘 날짜: " + today);
        System.out.println("📊 계산된 Day: " + dayNumber);
        
        return readingPlanRepository.findByDayNumber(dayNumber);
    }
    
    /**
     * 특정 일자의 읽기 계획 조회
     */
    public Optional<ReadingPlan> execute(Integer dayNumber) {
        if (dayNumber < 1 || dayNumber > 365) {
            throw new IllegalArgumentException("Day number must be between 1 and 365");
        }
        return readingPlanRepository.findByDayNumber(dayNumber);
    }
}
