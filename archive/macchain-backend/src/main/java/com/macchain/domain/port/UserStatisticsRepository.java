package com.macchain.domain.port;

import com.macchain.domain.entity.UserStatistics;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserStatisticsRepository {
    
    /**
     * 사용자의 최신 통계 조회
     */
    Optional<UserStatistics> findByUserIdAndStatisticsDate(Long userId, LocalDate statisticsDate);
    
    /**
     * 사용자의 모든 통계 조회
     */
    List<UserStatistics> findByUserId(Long userId);
    
    /**
     * 사용자의 월별 통계 조회
     */
    List<UserStatistics> findByUserIdAndMonth(Long userId, int year, int month);
    
    /**
     * 사용자의 연도별 통계 조회
     */
    List<UserStatistics> findByUserIdAndYear(Long userId, int year);
    
    /**
     * 통계 저장
     */
    UserStatistics save(UserStatistics userStatistics);
    
    /**
     * 사용자의 최신 통계 삭제
     */
    void deleteByUserIdAndStatisticsDate(Long userId, LocalDate statisticsDate);
}

