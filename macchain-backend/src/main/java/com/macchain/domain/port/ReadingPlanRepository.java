package com.macchain.domain.port;

import com.macchain.domain.entity.ReadingPlan;
import java.util.Optional;

/**
 * 읽기 계획 저장소 포트 (인터페이스)
 * 도메인 레이어에서 정의, 인프라스트럭처에서 구현
 */
public interface ReadingPlanRepository {
    
    /**
     * 하루 번호로 읽기 계획 조회
     */
    Optional<ReadingPlan> findByDayNumber(Integer dayNumber);
    
    /**
     * 오늘의 읽기 계획 조회 (현재 날짜 기준)
     */
    Optional<ReadingPlan> findTodayPlan();
    
    /**
     * 모든 읽기 계획 조회
     */
    java.util.List<ReadingPlan> findAll();
    
    /**
     * 읽기 계획 저장
     */
    ReadingPlan save(ReadingPlan readingPlan);
    
    /**
     * 읽기 계획 존재 여부 확인
     */
    boolean existsByDayNumber(Integer dayNumber);
}

