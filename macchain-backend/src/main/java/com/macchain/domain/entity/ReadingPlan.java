package com.macchain.domain.entity;

import com.macchain.domain.valueobject.Reading;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 맥체인 읽기 계획 도메인 엔티티
 * 비즈니스 로직과 규칙을 포함
 */
public class ReadingPlan {
    private Long id;
    private Integer dayNumber;
    private List<Reading> readings;
    private LocalDateTime createdAt;
    
    // 기본 생성자
    public ReadingPlan() {}
    
    // 모든 필드 생성자
    public ReadingPlan(Long id, Integer dayNumber, List<Reading> readings, LocalDateTime createdAt) {
        this.id = id;
        this.dayNumber = dayNumber;
        this.readings = readings;
        this.createdAt = createdAt;
    }
    
    // Getter/Setter 메서드들
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }
    
    public List<Reading> getReadings() { return readings; }
    public void setReadings(List<Reading> readings) { this.readings = readings; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public ReadingPlan(Long id, Integer dayNumber, List<Reading> readings) {
        this.id = id;
        this.dayNumber = dayNumber;
        this.readings = readings;
        this.createdAt = LocalDateTime.now();
    }
    
    // 비즈니스 규칙: 읽기 계획은 4개의 읽기 항목을 가져야 함
    public boolean isValid() {
        return readings != null && readings.size() == 4;
    }
    
    // 비즈니스 규칙: 하루 번호는 1-365 사이여야 함
    public boolean isDayNumberValid() {
        return dayNumber != null && dayNumber >= 1 && dayNumber <= 365;
    }
    
    // 비즈니스 로직: 구약 읽기 개수 계산
    public long getOldTestamentReadingCount() {
        return readings.stream()
                .filter(Reading::isOldTestament)
                .count();
    }
    
    // 비즈니스 로직: 신약 읽기 개수 계산
    public long getNewTestamentReadingCount() {
        return readings.stream()
                .filter(Reading::isNewTestament)
                .count();
    }
}
