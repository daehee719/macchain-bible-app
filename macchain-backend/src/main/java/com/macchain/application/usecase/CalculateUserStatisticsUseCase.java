package com.macchain.application.usecase;

import com.macchain.domain.entity.UserProgress;
import com.macchain.domain.entity.UserStatistics;
import com.macchain.domain.port.UserProgressRepository;
import com.macchain.domain.port.UserStatisticsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 사용자 통계 계산 유스케이스
 */
@Service
public class CalculateUserStatisticsUseCase {
    
    private final UserProgressRepository userProgressRepository;
    private final UserStatisticsRepository userStatisticsRepository;
    
    public CalculateUserStatisticsUseCase(UserProgressRepository userProgressRepository,
                                        UserStatisticsRepository userStatisticsRepository) {
        this.userProgressRepository = userProgressRepository;
        this.userStatisticsRepository = userStatisticsRepository;
    }
    
    /**
     * 사용자 통계 계산 및 저장
     */
    public UserStatistics execute(Long userId) {
        LocalDate today = LocalDate.now();
        
        // 기존 통계 조회
        Optional<UserStatistics> existingStats = userStatisticsRepository.findByUserIdAndStatisticsDate(userId, today);
        
        // 통계 계산
        UserStatistics statistics = calculateStatistics(userId, today);
        
        // 저장
        return userStatisticsRepository.save(statistics);
    }
    
    /**
     * 통계 계산 로직
     */
    private UserStatistics calculateStatistics(Long userId, LocalDate statisticsDate) {
        // 기본값으로 초기화
        UserStatistics stats = new UserStatistics();
        stats.setUserId(userId);
        stats.setStatisticsDate(statisticsDate);
        stats.setCreatedAt(LocalDateTime.now());
        stats.setUpdatedAt(LocalDateTime.now());
        
        // 최근 30일간의 진행률 데이터 조회
        List<UserProgress> recentProgress = getRecentProgress(userId, 30);
        
        // 기본 통계 계산
        calculateBasicStatistics(stats, recentProgress);
        
        // 월별 통계 계산
        calculateMonthlyStatistics(stats, recentProgress, statisticsDate);
        
        // 연도별 통계 계산
        calculateYearlyStatistics(stats, recentProgress, statisticsDate);
        
        // 최고 기록 계산
        calculateBestRecords(stats, recentProgress);
        
        // 최근 7일 통계 계산
        calculateLast7DaysStatistics(stats, recentProgress);
        
        return stats;
    }
    
    /**
     * 최근 N일간의 진행률 데이터 조회
     */
    private List<UserProgress> getRecentProgress(Long userId, int days) {
        List<UserProgress> progressList = new ArrayList<>();
        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            userProgressRepository.findByUserIdAndReadingDate(userId, date)
                    .ifPresent(progressList::add);
        }
        
        return progressList;
    }
    
    /**
     * 기본 통계 계산
     */
    private void calculateBasicStatistics(UserStatistics stats, List<UserProgress> recentProgress) {
        int totalDaysRead = 0;
        int totalChaptersRead = 0;
        double totalProgress = 0.0;
        int perfectDays = 0;
        int consecutiveDays = 0;
        int currentStreak = 0;
        
        // 최근 30일 기준으로 계산
        for (UserProgress progress : recentProgress) {
            if (progress.getCompletedReadings() > 0) {
                totalDaysRead++;
                totalChaptersRead += progress.getCompletedReadings();
                totalProgress += progress.getProgressPercentage();
                
                if (progress.getProgressPercentage() >= 100.0) {
                    perfectDays++;
                }
                
                currentStreak++;
            } else {
                // 연속 읽기 일수 업데이트
                if (currentStreak > consecutiveDays) {
                    consecutiveDays = currentStreak;
                }
                currentStreak = 0;
            }
        }
        
        // 마지막 연속 읽기 일수 확인
        if (currentStreak > consecutiveDays) {
            consecutiveDays = currentStreak;
        }
        
        stats.setTotalDaysRead(totalDaysRead);
        stats.setTotalChaptersRead(totalChaptersRead);
        stats.setAverageProgress(recentProgress.isEmpty() ? 0.0 : totalProgress / recentProgress.size());
        stats.setPerfectDays(perfectDays);
        stats.setConsecutiveDays(consecutiveDays);
    }
    
    /**
     * 월별 통계 계산
     */
    private void calculateMonthlyStatistics(UserStatistics stats, List<UserProgress> recentProgress, LocalDate statisticsDate) {
        int currentMonth = statisticsDate.getMonthValue();
        int currentYear = statisticsDate.getYear();
        
        int monthDays = 0;
        int monthChapters = 0;
        double monthProgress = 0.0;
        int monthProgressCount = 0;
        
        for (UserProgress progress : recentProgress) {
            if (progress.getReadingDate().getMonthValue() == currentMonth && 
                progress.getReadingDate().getYear() == currentYear) {
                if (progress.getCompletedReadings() > 0) {
                    monthDays++;
                    monthChapters += progress.getCompletedReadings();
                    monthProgress += progress.getProgressPercentage();
                    monthProgressCount++;
                }
            }
        }
        
        stats.setCurrentMonthDays(monthDays);
        stats.setCurrentMonthChapters(monthChapters);
        stats.setCurrentMonthProgress(monthProgressCount > 0 ? monthProgress / monthProgressCount : 0.0);
    }
    
    /**
     * 연도별 통계 계산
     */
    private void calculateYearlyStatistics(UserStatistics stats, List<UserProgress> recentProgress, LocalDate statisticsDate) {
        int currentYear = statisticsDate.getYear();
        
        int yearDays = 0;
        int yearChapters = 0;
        double yearProgress = 0.0;
        int yearProgressCount = 0;
        
        for (UserProgress progress : recentProgress) {
            if (progress.getReadingDate().getYear() == currentYear) {
                if (progress.getCompletedReadings() > 0) {
                    yearDays++;
                    yearChapters += progress.getCompletedReadings();
                    yearProgress += progress.getProgressPercentage();
                    yearProgressCount++;
                }
            }
        }
        
        stats.setCurrentYearDays(yearDays);
        stats.setCurrentYearChapters(yearChapters);
        stats.setCurrentYearProgress(yearProgressCount > 0 ? yearProgress / yearProgressCount : 0.0);
    }
    
    /**
     * 최고 기록 계산
     */
    private void calculateBestRecords(UserStatistics stats, List<UserProgress> recentProgress) {
        int longestStreak = 0;
        int currentStreak = 0;
        LocalDate streakStart = null;
        LocalDate streakEnd = null;
        LocalDate currentStreakStart = null;
        
        for (UserProgress progress : recentProgress) {
            if (progress.getCompletedReadings() > 0) {
                if (currentStreak == 0) {
                    currentStreakStart = progress.getReadingDate();
                }
                currentStreak++;
            } else {
                if (currentStreak > longestStreak) {
                    longestStreak = currentStreak;
                    streakStart = currentStreakStart;
                    streakEnd = progress.getReadingDate().minusDays(1);
                }
                currentStreak = 0;
                currentStreakStart = null;
            }
        }
        
        // 마지막 연속 읽기 확인
        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
            streakStart = currentStreakStart;
            streakEnd = LocalDate.now();
        }
        
        stats.setLongestStreak(longestStreak);
        stats.setLongestStreakStart(streakStart);
        stats.setLongestStreakEnd(streakEnd);
    }
    
    /**
     * 최근 7일 통계 계산
     */
    private void calculateLast7DaysStatistics(UserStatistics stats, List<UserProgress> recentProgress) {
        List<UserStatistics.DailyProgress> last7Days = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            UserStatistics.DailyProgress dailyProgress = new UserStatistics.DailyProgress();
            dailyProgress.setDate(date);
            
            // 해당 날짜의 진행률 찾기
            recentProgress.stream()
                    .filter(progress -> progress.getReadingDate().equals(date))
                    .findFirst()
                    .ifPresentOrElse(
                            progress -> {
                                dailyProgress.setChaptersRead(progress.getCompletedReadings());
                                dailyProgress.setProgressPercentage(progress.getProgressPercentage());
                                dailyProgress.setCompleted(progress.getProgressPercentage() >= 100.0);
                            },
                            () -> {
                                dailyProgress.setChaptersRead(0);
                                dailyProgress.setProgressPercentage(0.0);
                                dailyProgress.setCompleted(false);
                            }
                    );
            
            last7Days.add(dailyProgress);
        }
        
        stats.setLast7Days(last7Days);
    }
}

