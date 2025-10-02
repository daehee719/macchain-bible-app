package com.macchain.application.usecase;

import com.macchain.domain.entity.UserStatistics;
import com.macchain.domain.port.UserStatisticsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 사용자 통계 조회 유스케이스
 */
@Service
public class GetUserStatisticsUseCase {
    
    private final UserStatisticsRepository userStatisticsRepository;
    private final CalculateUserStatisticsUseCase calculateUserStatisticsUseCase;
    
    public GetUserStatisticsUseCase(UserStatisticsRepository userStatisticsRepository,
                                   CalculateUserStatisticsUseCase calculateUserStatisticsUseCase) {
        this.userStatisticsRepository = userStatisticsRepository;
        this.calculateUserStatisticsUseCase = calculateUserStatisticsUseCase;
    }
    
    /**
     * 사용자의 최신 통계 조회 (없으면 계산하여 생성)
     */
    public UserStatistics getLatestStatistics(Long userId) {
        LocalDate today = LocalDate.now();
        
        return userStatisticsRepository.findByUserIdAndStatisticsDate(userId, today)
                .orElseGet(() -> calculateUserStatisticsUseCase.execute(userId));
    }
    
    /**
     * 사용자의 특정 날짜 통계 조회
     */
    public Optional<UserStatistics> getStatisticsByDate(Long userId, LocalDate date) {
        return userStatisticsRepository.findByUserIdAndStatisticsDate(userId, date);
    }
    
    /**
     * 사용자의 모든 통계 조회
     */
    public List<UserStatistics> getAllStatistics(Long userId) {
        return userStatisticsRepository.findByUserId(userId);
    }
    
    /**
     * 사용자의 월별 통계 조회
     */
    public List<UserStatistics> getMonthlyStatistics(Long userId, int year, int month) {
        return userStatisticsRepository.findByUserIdAndMonth(userId, year, month);
    }
    
    /**
     * 사용자의 연도별 통계 조회
     */
    public List<UserStatistics> getYearlyStatistics(Long userId, int year) {
        return userStatisticsRepository.findByUserIdAndYear(userId, year);
    }
    
    /**
     * 통계 새로고침 (강제 재계산)
     */
    public UserStatistics refreshStatistics(Long userId) {
        LocalDate today = LocalDate.now();
        
        // 기존 통계 삭제
        userStatisticsRepository.deleteByUserIdAndStatisticsDate(userId, today);
        
        // 새로 계산하여 저장
        return calculateUserStatisticsUseCase.execute(userId);
    }
}

